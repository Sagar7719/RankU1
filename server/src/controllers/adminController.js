import User from "../models/userModel.js";
import Test from "../models/testModel.js";
import Question from "../models/questionModel.js";
import Result from "../models/resultModel.js";
import Topper from "../models/topperModel.js";

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (req, res) => {
  try {
    const { filter } = req.query;
    let dateQuery = {};

    if (filter === '7D') {
      dateQuery = { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
    } else if (filter === '30D') {
      dateQuery = { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
    }

    const totalUsers = await User.countDocuments(dateQuery);
    const totalTests = await Test.countDocuments(dateQuery);
    const totalQuestions = await Question.countDocuments(dateQuery);

    // Active users (created in last 7 days)
    const active7d = await User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } });

    // Paid users
    const paidUsers = await User.countDocuments({ ...dateQuery, "plan.isActive": true });

    // Revenue calculations
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const revenueTodayResult = await User.aggregate([
      { $match: { "plan.isActive": true, "plan.buyDate": { $gte: today } } },
      { $group: { _id: null, total: { $sum: "$plan.price" } } }
    ]);
    const revenueToday = revenueTodayResult[0]?.total || 0;

    const monthlyRevResult = await User.aggregate([
      { $match: { "plan.isActive": true, "plan.buyDate": { $gte: firstDayOfMonth } } },
      { $group: { _id: null, total: { $sum: "$plan.price" } } }
    ]);
    const monthlyRev = monthlyRevResult[0]?.total || 0;

    res.json({
      totalUsers,
      totalTests,
      totalQuestions,
      active7d,
      paidUsers,
      revenueToday: `₹${revenueToday}`,
      monthlyRev: `₹${monthlyRev}`,
      conversion: totalUsers > 0 ? `${((paidUsers / totalUsers) * 100).toFixed(1)}%` : '0%',
      referrals: 0 // Mock for now
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all test results
// @route   GET /api/admin/results
// @access  Private/Admin
export const getTestResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate("userId", "name email profilePicture")
      .populate("testId", "title category")
      .sort("-createdAt");
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a test result
// @route   DELETE /api/admin/results/:id
// @access  Private/Admin
export const deleteTestResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }
    await result.deleteOne();
    res.json({ message: 'Test result deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured topper
// @route   GET /api/admin/topper
// @access  Public
export const getTopper = async (req, res) => {
  try {
    let topper = await Topper.findOne();
    if (!topper) {
      // Initialize a default topper setting document if none exists
      topper = new Topper({
        name: "Shruti Patil",
        subTitle: "Aspirant | Talathi Exam",
        rank: "AIR 12",
        totalTests: 12,
        accuracy: 94,
        score: "188/200",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        isAutomatic: true
      });
      await topper.save();
    }

    if (topper.isAutomatic) {
      // Find the user with the highest score from actual results in the database
      const bestResult = await Result.findOne()
        .populate("userId", "name email profilePicture")
        .populate("testId", "title category")
        .sort("-score -createdAt"); // Sort by highest score first, then newest
      
      if (bestResult && bestResult.userId) {
        // Count total attempts for this user
        const totalAttempts = await Result.countDocuments({ userId: bestResult.userId._id });
        
        // Calculate accuracy
        const total = bestResult.correctAnswers + bestResult.wrongAnswers;
        const accuracy = total > 0 ? Math.round((bestResult.correctAnswers / total) * 100) : 90;
        
        const totalMarks = bestResult.totalMarks || (bestResult.correctAnswers + bestResult.wrongAnswers + bestResult.unattempted);
        
        return res.json({
          name: bestResult.userId.name,
          subTitle: `Aspirant | ${bestResult.testId?.category || 'Mock Tests'}`,
          rank: "AIR 1",
          totalTests: totalAttempts,
          accuracy,
          score: `${bestResult.score}/${totalMarks}`,
          avatar: bestResult.userId.profilePicture || "https://i.pravatar.cc/40",
          isAutomatic: true
        });
      } else {
        // Fallback to pre-configured manual topper if no results exist in DB yet
        return res.json(topper);
      }
    } else {
      // If manual mode is active, lookup the user by name to use their actual profile picture if set
      const user = await User.findOne({ name: topper.name });
      if (user && user.profilePicture) {
        const topperObj = topper.toObject();
        topperObj.avatar = user.profilePicture;
        topper = topperObj;
      }
      return res.json(topper);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update featured topper
// @route   PUT /api/admin/topper
// @access  Private/Admin
export const updateTopper = async (req, res) => {
  try {
    let topper = await Topper.findOne();
    if (!topper) {
      topper = new Topper(req.body);
    } else {
      Object.assign(topper, req.body);
    }
    await topper.save();
    res.json(topper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add/Update user subscription (Payment details)
// @route   PUT /api/admin/users/:id/subscription
// @access  Private/Admin
export const updateUserSubscription = async (req, res) => {
  try {
    const { name, price, buyDate, expireDate, paymentMethod, transactionId } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.plan = {
      name,
      price: Number(price) || 0,
      buyDate: buyDate ? new Date(buyDate) : new Date(),
      expireDate: expireDate ? new Date(expireDate) : new Date(),
      paymentMethod: paymentMethod || 'Admin Grant',
      transactionId: transactionId || `TXN${Math.floor(100000000 + Math.random() * 900000000)}`,
      isActive: true
    };

    await user.save();
    res.json({ success: true, message: 'Subscription added/updated successfully', plan: user.plan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove user subscription (Remove payment detail)
// @route   DELETE /api/admin/users/:id/subscription
// @access  Private/Admin
export const removeUserSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.plan) {
      user.plan = {
        name: "",
        price: 0,
        buyDate: null,
        expireDate: null,
        paymentMethod: "",
        transactionId: "",
        isActive: false
      };
    }

    await user.save();
    res.json({ success: true, message: 'Subscription removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
