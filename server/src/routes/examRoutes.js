import express from "express";
import { getExams, createExam, updateExam, deleteExam } from "../controllers/examController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getExams)
  .post(protect, admin, createExam);

router.route("/:id")
  .put(protect, admin, updateExam)
  .delete(protect, admin, deleteExam);

export default router;
