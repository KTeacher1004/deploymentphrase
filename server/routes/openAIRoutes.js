import express from "express";
import { getBulkFeedback } from "../controllers/openAIController.js";
const router = express.Router();

// Route to get bulk feedback from OpenAI
router.post("/bulk-feedback", getBulkFeedback);

export default router;
