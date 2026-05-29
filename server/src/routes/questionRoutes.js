import express from "express";
import { 
  getQuestionsByTestId, 
  createQuestion, 
  updateQuestion, 
  deleteQuestion 
} from "../controllers/questionController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/test/:testId", protect, getQuestionsByTestId);
router.post("/", protect, admin, createQuestion);

router.route("/:id")
  .put(protect, admin, updateQuestion)
  .delete(protect, admin, deleteQuestion);

export default router;
