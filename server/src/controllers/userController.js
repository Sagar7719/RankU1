import User from "../models/userModel.js";

export const updateUserProfile = async (req, res, next) => {
  try {
    const user = req.user;

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.profilePicture !== undefined) {
      user.profilePicture = req.body.profilePicture;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobileNumber: updatedUser.mobileNumber,
        referralCode: updatedUser.referralCode,
        profilePicture: updatedUser.profilePicture,
        rewardPoints: updatedUser.rewardPoints,
        plan: updatedUser.plan,
        createdAt: updatedUser.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req, res) => {
  res.json(req.user);
};

export const updateUserPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please provide current and new password" });
    }

    // The req.user from middleware excludes the password field, so we must fetch it again
    const user = await User.findById(req.user._id);

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const subscribeUser = async (req, res, next) => {
  try {
    const { name, price, buyDate, expireDate, paymentMethod, transactionId } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.plan = {
      name,
      price,
      buyDate,
      expireDate,
      paymentMethod,
      transactionId,
      isActive: true
    };

    await user.save();
    res.json({ success: true, message: "Subscription updated successfully", plan: user.plan });
  } catch (error) {
    next(error);
  }
};