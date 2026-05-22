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
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// enable CORS
app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/exams", examRoutes);

app.use(errorHandler);

export default app;