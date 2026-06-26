import User from "../models/userModel.js";

export const registerService = async (name, email, password, mobileNumber) => {
  const normalizedEmail = email.toLowerCase().trim();

  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    throw new Error("User already exists");
  }

  if (mobileNumber) {
    const mobileExists = await User.findOne({ mobileNumber });
    if (mobileExists) {
      throw new Error("Mobile number already in use");
    }
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    mobileNumber,
    isVerified: false,
    verificationOtp: otp,
    verificationOtpExpire: Date.now() + 10 * 60 * 1000
  });

  return user;
};

export const loginService = async (identifier, password) => {
  if (!identifier) {
    throw new Error("Please provide email or mobile number");
  }

  const isEmail = identifier.includes("@");
  const query = isEmail
    ? { email: identifier.toLowerCase().trim() }
    : { mobileNumber: identifier.trim() };

  const user = await User.findOne(query);

  if (!user) {
    throw new Error("User not found");
  }

  // Allow admin users to login without verification
  if (!user.isVerified && user.role !== 'admin') {
    throw new Error("Please verify your OTP before logging in");
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new Error("Invalid password");
  }

  return user;
};