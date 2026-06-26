import express from "express";
import { validateCoupon, getReferralStats, createCoupon } from "../controllers/rewardController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/validate", protect, validateCoupon);
router.get("/referral-stats", protect, getReferralStats);
router.post("/admin/create", protect, admin, createCoupon);

export default router;
