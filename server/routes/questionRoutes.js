import express from "express";
import {
    getQuestionsBySet,
    getQuestionById,
    createQuestion,
    addMultipleQuestions,
    updateQuestion,
    deleteQuestion,
} from "../controllers/questionController.js";

const router = express.Router();

// Get all questions by questionSetId (query param)
router.get("/", getQuestionsBySet);

// Get a single question by ID
router.get("/:id", getQuestionById);

// Create a new question
router.post("/", createQuestion);

// Create multiple questions
router.post("/multiple", addMultipleQuestions);

// Update a question by ID
router.put("/:id", updateQuestion);

// Delete a question by ID
router.delete("/:id", deleteQuestion);

export default router;
