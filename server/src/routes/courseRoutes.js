import express from "express";
import { getCourses, createCourse, updateCourse, deleteCourse } from "../controllers/courseController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getCourses)
  .post(protect, admin, upload.single('image'), createCourse);

router.route("/:id")
  .put(protect, admin, upload.single('image'), updateCourse)
  .delete(protect, admin, deleteCourse);

export default router;
