import express from "express";
import { getExams, createExam, updateExam, deleteExam } from "../controllers/examController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getExams)
  .post(protect, admin, upload.fields([{ name: 'syllabusPdf', maxCount: 1 }, { name: 'image', maxCount: 1 }]), createExam);

router.route("/:id")
  .put(protect, admin, upload.fields([{ name: 'syllabusPdf', maxCount: 1 }, { name: 'image', maxCount: 1 }]), updateExam)
  .delete(protect, admin, deleteExam);

export default router;
