import Coupon from "../models/couponModel.js";
import User from "../models/userModel.js";

// VALIDATE COUPON
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(), 
      isActive: true,
      expiryDate: { $gt: new Date() }
    });

    if (!coupon) {
      return res.status(404).json({ message: "Invalid or expired coupon code" });
    }

    res.json({
      success: true,
      discountPercentage: coupon.discountPercentage,
      code: coupon.code
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET REFERRAL STATS
export const getReferralStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const referredUsers = await User.find({ referredBy: userId }).select("name createdAt");
    
    res.json({
      referralCode: req.user.referralCode,
      rewardPoints: req.user.rewardPoints || 0,
      totalReferred: referredUsers.length,
      referredUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: CREATE COUPON
export const createCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, expiryDate, description } = req.body;
    const coupon = await Coupon.create({
      code,
      discountPercentage,
      expiryDate,
      description
    });
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
