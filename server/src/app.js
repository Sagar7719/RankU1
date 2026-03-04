import express from "express";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

// error middleware must be last
app.use(errorHandler);

export default app;