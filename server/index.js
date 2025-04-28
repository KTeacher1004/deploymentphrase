import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import questionSetRoutes from './routes/questionSetRoutes.js';
import questionRoutes from "./routes/questionRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import testResultRoutes from "./routes/testResultRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import openaAIRoutes from "./routes/openAIRoutes.js";
import cookieParser from "cookie-parser";
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables and create an express app
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://35.192.144.82",
    credentials: true,
  })
)

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", authRoutes);
app.use("/api/question-sets", questionSetRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/test-results", testResultRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai-suggestion", openaAIRoutes);

app.listen(PORT,'0.0.0.0', () => console.log(`✅ Server running on port ${PORT}`));

