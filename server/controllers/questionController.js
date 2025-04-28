import Question from "../models/questionModel.js";
import Test from "../models/testModel.js";

// Get all questions by set ID
export const getQuestionsBySet = async (req, res) => {
    try {
        const { questionSetId } = req.query;
        if (!questionSetId) return res.status(400).json({ message: "Missing questionSetId" });

        const questions = await Question.find({ questionSetId });
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching questions", error });
    }
};

// Get a single question with question ID
export const getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) return res.status(404).json({ message: "Question not found" });

        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ message: "Error fetching question", error });
    }
};

// Create new question
export const createQuestion = async (req, res) => {
    try {
        const newQuestion = new Question(req.body);
        const isUsed = await checkQuestionSetUsage(newQuestion.questionSetId, res);
        if (isUsed) return; // Already responded inside the helper
        const savedQuestion = await newQuestion.save();
        res.status(201).json(savedQuestion);
    } catch (error) {
        res.status(400).json({ message: "Error creating question", error });
    }
};

// Create new questions
export const addMultipleQuestions = async (req, res) => {
    try {
        const { questions } = req.body;
        const isUsed = await checkQuestionSetUsage(questions[0].questionSetId, res);
        if (isUsed) return;

        // Check if questions is an array and contains at least one question
        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ message: "Invalid input: 'questions' should be a non-empty array" });
        }

        // Insert multiple questions at once using insertMany (this is more efficient than saving each individually)
        const savedQuestions = await Question.insertMany(questions);

        // Respond with the saved questions
        res.status(201).json(savedQuestions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update a question by ID
export const updateQuestion = async (req, res) => {
    try {
        const isUsed = await checkQuestionSetUsage(question.questionSetId, res);
        if (isUsed) return;
        const updatedQuestion = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedQuestion) return res.status(404).json({ message: "Question not found" });

        res.status(200).json(updatedQuestion);
    } catch (error) {
        res.status(500).json({ message: "Error updating question", error });
    }
};

// Delete a question by ID
export const deleteQuestion = async (req, res) => {
    try {
        //find the question first
        const question = await Question.findById(req.params.id);
        if (!question) return res.status(404).json({ message: "Question not found" });
        // Check if the question is used in any test
        const isUsed = await checkQuestionSetUsage(question.questionSetId, res);
        if (isUsed) return; 

        // If not used, delete the question
        const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
        if (!deletedQuestion) return res.status(404).json({ message: "Question not found" });

        res.status(200).json({ message: "Question successfully deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting question", error });
    }
};

export const checkQuestionSetUsage = async (questionSetId, res) => {
    try {
        const tests = await Test.find({ questionSetId });
        if (tests.length > 0) {
            const testNames = tests.map(t => t.title).join(", ");
            res.status(400).json({
                message: `This question set is already used in test(s): ${testNames}. Operation not allowed.`
            });
            return true; // used, stop the flow
        }
        return false; // not used, allow operation
    } catch (error) {
        console.error("Error checking question set usage:", error);
        res.status(500).json({ message: "Server error while checking question set usage", error });
        return true; // treat as blocked just in case
    }
};
