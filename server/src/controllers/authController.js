import generateToken from "../utils/generateToken.js";
import { registerService, loginService } from "../services/authService.js";
import { sendRealEmail } from "../utils/emailService.js";
import { sendRealSMS } from "../utils/smsService.js";
import User from "../models/userModel.js";

const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  mobileNumber: user.mobileNumber,
  referralCode: user.referralCode,
  profilePicture: user.profilePicture,
  rewardPoints: user.rewardPoints,
  plan: user.plan,
  isVerified: user.isVerified,
  createdAt: user.createdAt
});

const sendVerificationEmail = async (user, otp) => {
  const isEmailConfigured = process.env.EMAIL_USER && process.env.EMAIL_USER !== "your-email@gmail.com";

  if (isEmailConfigured && user.email) {
    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 550px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 25px;">
          <h1 style="color: #4f46e5; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">RankU1</h1>
        </div>
        <p style="font-size: 16px; color: #1e293b; line-height: 1.6;">Hello <strong>${user.name}</strong>,</p>
        <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 25px;">Use the verification code below to activate your account:</p>
        <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; text-align: center; padding: 18px; font-size: 28px; font-weight: 800; color: #1e1b4b; border-radius: 8px; letter-spacing: 6px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin-top: 25px;">This verification code is valid for <strong>10 minutes</strong>.</p>
      </div>
    `;

    await sendRealEmail(user.email, "RankU1 Account Verification", emailHtml);
  } else {
    console.log(`\n\n[GMAIL SIMULATION] To: ${user.email}\nSubject: RankU1 Account Verification\nOTP: ${otp}\n\n`);
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, mobileNumber } = req.body;

    const user = await registerService(name, email, password, mobileNumber);

    await sendVerificationEmail(user, user.verificationOtp);

    res.status(201).json({
      success: true,
      message: "Registration successful. Please verify OTP before logging in.",
      user: buildUserResponse(user)
    });
  } catch (error) {
    console.log("ERROR OCCURRED:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const verifyRegistrationOtp = async (req, res) => {
  try {
    let { identifier, email, mobileNumber, otp } = req.body;

    if (!identifier) {
      identifier = email || mobileNumber;
    }

    if (!identifier || !otp) {
      return res.status(400).json({
        success: false,
        message: "Please provide email or mobile number and OTP"
      });
    }

    const isEmailInput = identifier.includes("@");
    const query = {
      verificationOtp: otp,
      verificationOtpExpire: { $gt: Date.now() },
      ...(isEmailInput
        ? { email: identifier.toLowerCase().trim() }
        : { mobileNumber: identifier.trim() })
    };

    const user = await User.findOne(query);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    user.isVerified = true;
    user.verificationOtp = undefined;
    user.verificationOtpExpire = undefined;
    await user.save();

    res.json({
      success: true,
      token: generateToken(user._id),
      user: buildUserResponse(user)
    });
  } catch (error) {
    console.error("verifyRegistrationOtp error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resendRegistrationOtp = async (req, res) => {
  try {
    let { identifier, email, mobileNumber } = req.body;

    if (!identifier) {
      identifier = email || mobileNumber;
    }

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: "Please provide either Email or Mobile number"
      });
    }

    const isEmailInput = identifier.includes("@");
    const query = isEmailInput
      ? { email: identifier.toLowerCase().trim() }
      : { mobileNumber: identifier.trim() };

    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with this ${isEmailInput ? "email" : "mobile number"} not found`
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User is already verified"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationOtp = otp;
    user.verificationOtpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendVerificationEmail(user, otp);

    res.json({
      success: true,
      message: "Verification OTP sent successfully"
    });
  } catch (error) {
    console.error("resendRegistrationOtp error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, email, mobileNumber, password } = req.body;
    const loginId = identifier || email || mobileNumber;

    const user = await loginService(loginId, password);

    res.json({
      success: true,
      token: generateToken(user._id),
      user: buildUserResponse(user)
    });
  } catch (error) {
    console.error("login error:", error);

    const knownErrors = [
      "Please provide email or mobile number",
      "User not found",
      "Invalid password",
      "Please verify your OTP before logging in"
    ];

    res.status(knownErrors.includes(error.message) ? 401 : 500).json({
      success: false,
      message: error.message
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    let { identifier, email, mobileNumber } = req.body;
    if (!identifier) {
      identifier = email || mobileNumber;
    }

    if (!identifier) {
      return res.status(400).json({ success: false, message: "Please provide either Email or Mobile number" });
    }

    const isEmailInput = identifier.includes('@');
    const query = isEmailInput
      ? { email: identifier.toLowerCase().trim() }
      : { mobileNumber: identifier.trim() };

    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with this ${isEmailInput ? 'email' : 'mobile number'} not found`
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    const isEmailConfigured = process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your-email@gmail.com';
    const isSmsConfigured = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID !== 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

    if (isEmailConfigured && user.email) {
      const emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 550px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="color: #4f46e5; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">RankU1</h1>
          </div>
          <p style="font-size: 16px; color: #1e293b; line-height: 1.6;">Hello <strong>${user.name}</strong>,</p>
          <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 25px;">We received a request to reset your password. Use the secure verification code below:</p>
          <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; text-align: center; padding: 18px; font-size: 28px; font-weight: 800; color: #1e1b4b; border-radius: 8px; letter-spacing: 6px; margin: 20px 0;">
            ${otp}
          </div>
        </div>
      `;
      await sendRealEmail(user.email, "RankU1 Password Reset OTP", emailHtml);
    } else {
      console.log(`\n\n[GMAIL SIMULATION] To: ${user.email}\nSubject: RankU1 Password Reset OTP\nOTP: ${otp}\n\n`);
    }

    if (!isEmailInput && user.mobileNumber) {
      if (isSmsConfigured) {
        await sendRealSMS(
          user.mobileNumber,
          `RankU1: Verification code ${otp} sent to your registered Gmail address.`
        );
      } else {
        console.log(`\n\n[SMS SIMULATION] To: ${user.mobileNumber}\nMessage: OTP sent to your registered Gmail\n\n`);
      }
    }

    res.json({
      success: true,
      message: "Verification code sent successfully"
    });
  } catch (error) {
    console.error("forgotPassword error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOtpAndReset = async (req, res) => {
  try {
    let { identifier, email, mobileNumber, otp, newPassword } = req.body;
    if (!identifier) {
      identifier = email || mobileNumber;
    }

    if (!identifier || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: "Please provide email/mobile number, OTP, and new password" });
    }

    const isEmailInput = identifier.includes('@');
    const query = {
      resetOtp: otp,
      resetOtpExpire: { $gt: Date.now() },
      ...(isEmailInput
        ? { email: identifier.toLowerCase().trim() }
        : { mobileNumber: identifier.trim() })
    };

    const user = await User.findOne(query);

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const requestLoginOtp = async (req, res) => {
  try {
    let { identifier, email, mobileNumber } = req.body;
    if (!identifier) {
      identifier = email || mobileNumber;
    }

    if (!identifier) {
      return res.status(400).json({ success: false, message: "Please provide either Email or Mobile number" });
    }

    const isEmailInput = identifier.includes('@');
    const query = isEmailInput
      ? { email: identifier.toLowerCase().trim() }
      : { mobileNumber: identifier.trim() };

    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with this ${isEmailInput ? 'email' : 'mobile number'} not found`
      });
    }

    // For security, OTP login endpoints (/auth/login-otp/*) are for non-admin users only.
    if (user.role === 'admin') {
      return res.status(401).json({
        success: false,
        message: "Access Denied. Admins should use the admin panel"
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your registration OTP before using login OTP"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 5 * 60 * 1000;
    await user.save();

    if (isEmailInput) {
      const isEmailConfigured = process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your-email@gmail.com';
      if (isEmailConfigured) {
        const emailHtml = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 550px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="text-align: center; margin-bottom: 25px;">
              <h1 style="color: #4f46e5; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">RankU1</h1>
            </div>
            <p style="font-size: 16px; color: #1e293b; line-height: 1.6;">Hello <strong>${user.name}</strong>,</p>
            <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 25px;">Please use the secure login OTP below to access your account:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="display: inline-block; font-size: 32px; font-weight: 800; letter-spacing: 5px; color: #4f46e5; background: #eeebff; padding: 12px 35px; border-radius: 8px; border: 1px solid #dcd7ff;">
                ${otp}
              </span>
            </div>
          </div>
        `;
        await sendRealEmail(user.email, "RankU1 Secure Login OTP", emailHtml);
      } else {
        console.log(`\n\n[GMAIL SIMULATION] To: ${user.email}\nSubject: RankU1 Secure Login OTP\nOTP: ${otp}\n\n`);
      }
    } else {
      const isSmsConfigured = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID !== 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
      if (isSmsConfigured && user.mobileNumber) {
        await sendRealSMS(
          user.mobileNumber,
          `Your RankU1 secure login code is: ${otp}. Valid for 5 minutes.`
        );
      } else {
        console.log(`\n\n[SMS SIMULATION] To: ${user.mobileNumber}\nMessage: Your RankU1 secure login code is: ${otp}\n\n`);
      }
    }

    res.json({
      success: true,
      message: "Login OTP code sent successfully"
    });
  } catch (error) {
    console.error("requestLoginOtp error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginWithOtp = async (req, res) => {
  try {
    let { identifier, email, mobileNumber, otp } = req.body;
    if (!identifier) {
      identifier = email || mobileNumber;
    }

    if (!identifier || !otp) {
      return res.status(400).json({ success: false, message: "Please provide email or mobile number and OTP" });
    }

    const isEmailInput = identifier.includes('@');
    const query = {
      resetOtp: otp,
      resetOtpExpire: { $gt: Date.now() },
      ...(isEmailInput
        ? { email: identifier.toLowerCase().trim() }
        : { mobileNumber: identifier.trim() })
    };

    const user = await User.findOne(query);
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // For security: OTP endpoints under /auth/login-otp/* are for non-admin users only.
    if (user.role === 'admin') {
      return res.status(401).json({
        success: false,
        message: "Access Denied. Admins should use the admin panel"
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your registration OTP before logging in"
      });
    }

    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;
    await user.save();

    res.json({
      success: true,
      token: generateToken(user._id),
      user: buildUserResponse(user)
    });
  } catch (error) {
    console.error("loginWithOtp error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin panel OTP login (mobile-based OTP), only for the registered admin mobile.
export const requestAdminLoginOtp = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    if (!mobileNumber) {
      return res.status(400).json({ success: false, message: "Please provide mobile number" });
    }

    const normalizedMobile = String(mobileNumber).trim();
    const adminMobile = '7058293263';

    // Ensure the user exists and is admin and mobile matches
    const adminUser = await User.findOne({ role: 'admin', mobileNumber: adminMobile });

    // If admin enters any other mobile, respond with required message.
    if (!adminUser || normalizedMobile !== adminMobile) {
      return res.status(401).json({ success: false, message: 'this is not admin registered mobile number' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    adminUser.adminLoginOtp = otp;
    adminUser.adminLoginOtpExpire = Date.now() + 5 * 60 * 1000;
    await adminUser.save();

    // Send OTP via SMS if Twilio is configured; otherwise log simulation.
    const isSmsConfigured = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID !== 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
    if (isSmsConfigured && adminUser.mobileNumber) {
      await sendRealSMS(adminUser.mobileNumber, `Your RankU1 admin login OTP is: ${otp}. Valid for 5 minutes.`);
    } else {
      console.log(`\n\n[ADMIN SMS SIMULATION] To: ${adminUser.mobileNumber}\nOTP: ${otp}\n\n`);
    }

    res.json({ success: true, message: 'Admin OTP sent successfully' });
  } catch (error) {
    console.error('requestAdminLoginOtp error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyAdminLoginOtp = async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;

    if (!mobileNumber || !otp) {
      return res.status(400).json({ success: false, message: 'Please provide mobile number and OTP' });
    }

    const normalizedMobile = String(mobileNumber).trim();
    const adminMobile = '7058293263';

    if (normalizedMobile !== adminMobile) {
      return res.status(401).json({ success: false, message: 'this is not admin registered mobile number' });
    }

    const adminUser = await User.findOne({
      role: 'admin',
      mobileNumber: adminMobile,
      adminLoginOtp: otp,
      adminLoginOtpExpire: { $gt: Date.now() }
    });

    if (!adminUser) {
      return res.status(401).json({ success: false, message: 'Invalid OTP' });
    }

    adminUser.adminLoginOtp = undefined;
    adminUser.adminLoginOtpExpire = undefined;
    await adminUser.save();

    res.json({
      success: true,
      token: generateToken(adminUser._id),
      user: buildUserResponse(adminUser)
    });
  } catch (error) {
    console.error('verifyAdminLoginOtp error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

