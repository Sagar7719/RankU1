import express from "express";
import { getAllNews, getNewsById, createNews } from "../controllers/newsController.js";

const router = express.Router();

router.route("/").get(getAllNews).post(createNews);
router.route("/:id").get(getNewsById);

export default router;
