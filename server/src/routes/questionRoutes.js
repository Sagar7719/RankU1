import express from "express";
import { 
  getQuestionsByTestId, 
  createQuestion, 
  updateQuestion, 
  deleteQuestion,
  importQuestionsFromPdf,
  bulkUpdateQuestions
} from "../controllers/questionController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import pdfUpload from "../middleware/pdfUploadMiddleware.js";

const router = express.Router();

router.get("/test/:testId", protect, getQuestionsByTestId);
router.post("/", protect, admin, createQuestion);
router.post("/import-pdf/:testId", protect, admin, pdfUpload.single('pdf'), importQuestionsFromPdf);
router.put("/test/:testId/bulk", protect, admin, bulkUpdateQuestions);

router.route("/:id")
  .put(protect, admin, updateQuestion)
  .delete(protect, admin, deleteQuestion);

export default router;
