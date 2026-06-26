import express from "express";
import { getTests, createTest, getTestById, updateTest, deleteTest, getTestForUser, submitTest, getResult, getMyResults, getDashboardStats } from "../controllers/testController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getTests) // Publicly visible
  .post(protect, admin, createTest); // Only admin can create tests

router.get("/my-results", protect, getMyResults);
router.get("/dashboard-stats", protect, getDashboardStats);
router.get("/results/:id", protect, getResult);
router.get("/:id/attempt", protect, getTestForUser);
router.post("/:id/submit", protect, submitTest);

router.route("/:id")
  .get(protect, getTestById)
  .put(protect, admin, updateTest)
  .delete(protect, admin, deleteTest);

export default router;