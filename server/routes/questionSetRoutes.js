import express from "express";
const router = express.Router();
import {
    getAllQuestionSets,
    getQuestionSetsByTeacher,
    getQuestionSetById,
    createQuestionSet,
    deleteQuestionSet
} from "../controllers/questionSetController.js";

router.get("/", getAllQuestionSets);

router.get("/teacher/:teacherId", getQuestionSetsByTeacher);

router.get("/:id", getQuestionSetById);

router.post("/", createQuestionSet);

router.delete("/:id", deleteQuestionSet);

export default router;
