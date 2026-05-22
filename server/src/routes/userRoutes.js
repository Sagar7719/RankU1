import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { updateUserProfile, updateUserPassword } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

router.put("/profile", protect, updateUserProfile);
router.put("/password", protect, updateUserPassword);

export default router;