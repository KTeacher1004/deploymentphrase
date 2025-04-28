import QuestionSet from "../models/questionSetModel.js";
import Question from "../models/questionModel.js";
import { checkQuestionSetUsage } from "./questionController.js";

// Get all question sets
export const getAllQuestionSets = async (req, res) => {
    try {
        const questionSets = await QuestionSet.find();
        res.status(200).json(questionSets);
    } catch (error) {
        res.status(500).json({ message: "Error fetching question sets", error });
    }
};

// Get question sets by teacherId
export const getQuestionSetsByTeacher = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const questionSets = await QuestionSet.find({ teacherId });
        if (!questionSets.length) return res.status(404).json({ message: "No question sets found for this teacher" });
        res.status(200).json(questionSets);
    } catch (error) {
        res.status(500).json({ message: "Error fetching question sets for teacher", error });
    }
};

// Get a single question set by ID
export const getQuestionSetById = async (req, res) => {
    try {
        const questionSet = await QuestionSet.findById(req.params.id);
        if (!questionSet) return res.status(404).json({ message: "Question set not found" });
        res.status(200).json(questionSet);
    } catch (error) {
        res.status(500).json({ message: "Error fetching question set", error });
    }
};

// Create a new question set
export const createQuestionSet = async (req, res) => {
    try {
        const newSet = new QuestionSet(req.body);
        const savedSet = await newSet.save();
        res.status(201).json(savedSet);
    } catch (error) {
        res.status(400).json({ message: "Error creating question set", error });
    }
};

// Delete a question set by ID
export const deleteQuestionSet = async (req, res) => {
    try {
        
        // check question set is used by test or not
        const isUsed = await checkQuestionSetUsage(req.params.id, res);
        if (isUsed) return;  
        const deletedSet = await QuestionSet.findByIdAndDelete(req.params.id);
        if (!deletedSet) return res.status(404).json({ message: "Question set not found" });
        await Question.deleteMany({ questionSetId: req.params.id });
        res.status(200).json({ message: "Question set successfully deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting question set", error });
    }
};
