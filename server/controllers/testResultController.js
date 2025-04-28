import TestResult from '../models/testResultModel.js';
import Test from '../models/testModel.js';

// Get test results for a student
export const getTestResultsByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const results = await TestResult.find({ studentId })
            .sort({ completedAt: -1 }).populate('testId');
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Error fetching test results", error });
    }
};

// Submit test results
export const submitTestResult = async (req, res) => {
    try {
        const { studentId, testId, answers, score, trueAnswer } = req.body;
        // Get the test to calculate score
        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({ message: "Test not found" });
        }

        // Create test result
        const testResult = new TestResult({
            studentId,
            testId,
            score,
            answers,
            trueAnswer,
        });
        console.log("Test Result:", testResult);

        const savedResult = await testResult.save();
        res.status(201).json(savedResult);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error submitting test result", error });
    }
};

// Get test results for a specific test
export const getTestResultsByTest = async (req, res) => {
    try {
        const { testId } = req.params;
        const results = await TestResult.find({ testId })
            .populate('studentId')
            .sort({ completedAt: -1 });
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Error fetching test results", error });
    }
};

// Get test result by ID
export const getTestResultById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await TestResult.findById(id)
            .populate('studentId')
            .populate('testId');
        if (!result) {
            return res.status(404).json({ message: "Test result not found" });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error fetching test result", error });
    }
};