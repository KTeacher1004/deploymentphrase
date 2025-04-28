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

// ✨ FIX CORS
const allowedOrigins = [
  'http://localhost:5173',                   // Cho phép localhost dev
  'https://deploymentphrase.vercel.app'       // Cho phép production trên Vercel
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Middlewares
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);         // ✅ Fix: `/api/users` chỉ nối với `userRoutes`, không cần authRoutes
app.use("/api/question-sets", questionSetRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/test-results", testResultRoutes);
app.use("/api/ai-suggestion", openaAIRoutes);

// Start server
app.listen(PORT, '0.0.0.0', () => console.log(`✅ Server running on port ${PORT}`));
