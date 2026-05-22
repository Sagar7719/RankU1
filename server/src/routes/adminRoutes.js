import express from "express";
import { getStats, getUsers, deleteUser } from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, admin, getStats);
router.get("/users", protect, admin, getUsers);
router.delete("/users/:id", protect, admin, deleteUser);

export default router;
