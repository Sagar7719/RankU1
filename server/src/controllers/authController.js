import generateToken from "../utils/generateToken.js";
import {
  registerService,
  loginService
} from "../services/authService.js";
import { sendRealEmail } from "../utils/emailService.js";
import { sendRealSMS } from "../utils/smsService.js";


// Register
export const register = async (req, res, next) => {

  try {

    const { name, email, password, mobileNumber } = req.body;

    const user = await registerService(
      name,
      email,
      password,
      mobileNumber
    );

    res.status(201).json({

      success: true,

      token: generateToken(user._id),

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }

    });

  } catch (error) {

  console.log("ERROR OCCURRED:", error);

  res.status(500).json({
    success: false,
    message: error.message
  });

}

};



// Login
export const login = async (req, res, next) => {

  try {

    const { email, password } = req.body;

    const user = await loginService(
      email,
      password
    );

    res.json({

      success: true,

      token: generateToken(user._id),

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }

    });

  } catch (error) {
  res.status(500).json({
    success: false,
    message: error.message
  });
}

};

import User from "../models/userModel.js";

// Forgot Password (Generate OTP)
export const forgotPassword = async (req, res, next) => {
  try {
    let { identifier, email, mobileNumber } = req.body;
    if (!identifier) {
      identifier = email || mobileNumber;
    }
    
    if (!identifier) {
      return res.status(400).json({ success: false, message: "Please provide either Email or Mobile number" });
    }

    const isEmailInput = identifier.includes('@');
    let query = {};
    if (isEmailInput) {
      query.email = identifier.toLowerCase().trim();
    } else {
      query.mobileNumber = identifier.trim();
    }

    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: `User with this ${isEmailInput ? 'email' : 'mobile number'} not found` 
      });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send Real Email & optional simulated SMS (we always prioritize the user's Gmail)
    const isEmailConfigured = process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your-email@gmail.com';
    const isSmsConfigured = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID !== 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

    if (isEmailConfigured && user.email) {
      const emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 550px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="color: #4f46e5; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">RankU1</h1>
          </div>
          <p style="font-size: 16px; color: #1e293b; line-height: 1.6;">Hello <strong>${user.name}</strong>,</p>
          <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 25px;">We received a request to verify your account or reset your password. Please use the secure verification code below to proceed:</p>
          <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; text-align: center; padding: 18px; font-size: 28px; font-weight: 800; color: #1e1b4b; border-radius: 8px; letter-spacing: 6px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin-top: 25px;">This verification code is valid for exactly <strong>10 minutes</strong>. If you did not request this, you can safely ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0;" />
          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">&copy; 2026 RankU1 Platform. All rights reserved.</p>
        </div>
      `;
      await sendRealEmail(user.email, "RankU1 Security Verification", emailHtml);
    } else {
      console.log(`\n\n[GMAIL SIMULATION] To: ${user.email}\nSubject: RankU1 Security Verification\nOTP: ${otp}\n(Configure EMAIL_USER and EMAIL_APP_PASS in .env to send real emails)\n\n`);
    }

    // Optional Twilio SMS notification if user input mobile number and Twilio is configured
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

    // Mask the email address to be elegant (e.g. sa***@gmail.com)
    let maskedEmail = user.email;
    if (user.email && user.email.includes('@')) {
      const parts = user.email.split('@');
      const start = parts[0].substring(0, 2);
      maskedEmail = `${start}***@${parts[1]}`;
    }

    res.json({ 
      success: true, 
      message: isEmailConfigured 
        ? `Verification code sent to your registered Gmail (${maskedEmail}) successfully!` 
        : `OTP sent successfully to your Gmail (Simulated in server logs)`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify OTP and Reset
export const verifyOtpAndReset = async (req, res, next) => {
  try {
    let { identifier, email, mobileNumber, otp, newPassword } = req.body;
    if (!identifier) {
      identifier = email || mobileNumber;
    }

    if (!identifier || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: "Please provide email/mobile number, OTP, and new password" });
    }

    const isEmailInput = identifier.includes('@');
    let query = { 
      resetOtp: otp,
      resetOtpExpire: { $gt: Date.now() }
    };

    if (isEmailInput) {
      query.email = identifier.toLowerCase().trim();
    } else {
      query.mobileNumber = identifier.trim();
    }

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

// Request Login OTP
export const requestLoginOtp = async (req, res, next) => {
  try {
    const { mobileNumber } = req.body;
    
    if (!mobileNumber) {
      return res.status(400).json({ success: false, message: "Mobile number is required" });
    }

    const user = await User.findOne({ mobileNumber });
    if (!user) {
      return res.status(404).json({ success: false, message: "User with this mobile number not found" });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Reuse resetOtp field for login OTP logic
    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    // Send Real SMS (with fallback simulation for placeholder values)
    const isSmsConfigured = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID !== 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

    if (isSmsConfigured) {
      await sendRealSMS(
        mobileNumber,
        `Your RankU1 secure login code is: ${otp}. Valid for 5 minutes.`
      );
    } else {
      console.log(`\n\n[SMS SIMULATION] To: ${mobileNumber}\nMessage: Your RankU1 secure login code is: ${otp}\n(Configure TWILIO credentials in .env to send real SMS)\n\n`);
    }

    res.json({ 
      success: true, 
      message: isSmsConfigured 
        ? "Login OTP code sent successfully!" 
        : "Login OTP sent successfully (Simulated in server logs)" 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login with OTP
export const loginWithOtp = async (req, res, next) => {
  try {
    const { mobileNumber, otp } = req.body;

    if (!mobileNumber || !otp) {
      return res.status(400).json({ success: false, message: "Please provide mobile number and OTP" });
    }

    const user = await User.findOne({ 
      mobileNumber, 
      resetOtp: otp,
      resetOtpExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Clear the OTP
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;
    await user.save();

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};