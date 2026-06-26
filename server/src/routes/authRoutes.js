import express from "express";
import {
  register,
  login,
  forgotPassword,
  verifyOtpAndReset,
  requestLoginOtp,
  loginWithOtp,
  verifyRegistrationOtp,
  resendRegistrationOtp,
  requestAdminLoginOtp,
  verifyAdminLoginOtp
} from "../controllers/authController.js";


const router = express.Router();

router.post("/register", register);
router.post("/register/verify-otp", verifyRegistrationOtp);
router.post("/register/resend-otp", resendRegistrationOtp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", verifyOtpAndReset);
router.post("/login-otp/request", requestLoginOtp);
router.post("/login-otp/verify", loginWithOtp);

// Admin panel OTP login (admin only)
router.post("/admin/login-otp/request", requestAdminLoginOtp);
router.post("/admin/login-otp/verify", verifyAdminLoginOtp);


export default router;