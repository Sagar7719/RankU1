import express from "express";
import { 
  getStats, 
  getUsers, 
  deleteUser, 
  getTestResults, 
  deleteTestResult, 
  getTopper, 
  updateTopper,
  updateUserSubscription,
  removeUserSubscription
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, admin, getStats);
router.get("/users", protect, admin, getUsers);
router.delete("/users/:id", protect, admin, deleteUser);
router.get("/results", protect, admin, getTestResults);
router.delete("/results/:id", protect, admin, deleteTestResult);

// User Subscription Management
router.put("/users/:id/subscription", protect, admin, updateUserSubscription);
router.delete("/users/:id/subscription", protect, admin, removeUserSubscription);

// Topper Configuration Routes
router.get("/topper", getTopper);
router.put("/topper", protect, admin, updateTopper);

export default router;
