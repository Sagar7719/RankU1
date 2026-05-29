import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import rewardRoutes from "./routes/rewardRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// enable CORS
app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/plans", planRoutes);

app.use(errorHandler);

export default app;