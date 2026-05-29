import express from "express";
import { 
  register, 
  login, 
  forgotPassword, 
  verifyOtpAndReset,
  requestLoginOtp,
  loginWithOtp
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", verifyOtpAndReset);
router.post("/login-otp/request", requestLoginOtp);
router.post("/login-otp/verify", loginWithOtp);

export default router;