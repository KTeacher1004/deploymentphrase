import Test from "../models/testModel.js";
import Question from "../models/questionModel.js";
import TestResult from "../models/testResultModel.js";

// Get all tests
export const getAllTests = async (req, res) => {
    try {
        if (req.query) {
            const searchQuery = req.query.searchQuery;
            const tests = await Test.find({
                title: { $regex: searchQuery, $options: "i" },
                status: 'published',
                mode: 'public'
            }).populate("teacherId", "name email");
            if (!tests.length) return res.status(404).json({ message: `${searchQuery} not found` });
            return res.status(200).json(tests);
        }
        const tests = await Test.find().populate("teacherId", "name email");
        res.status(200).json(tests);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tests", error });
    }
};

// Get tests by teacherId
export const getTestsByTeacher = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const tests = await Test.find({ teacherId });
        console.log(tests);
        if (!tests.length) return res.status(404).json({ message: "No tests found for this teacher" });
        res.status(200).json(tests);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tests for teacher", error });
    }
}

// Get tests for a student
export const getTestsByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        
        const tests = await Test.find({
            assignedStudentsId: studentId,
            status: 'published'
        }).populate({ path: 'teacherId', select: '-password' });

        if (!tests.length) {
            return res.status(404).json({ message: "No tests found for this student" });
        }

        res.status(200).json(tests);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tests for student", error });
    }
};

// Get a single test by ID
export const getTestById = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);
        if (!test) return res.status(404).json({ message: "Test not found" });
        res.status(200).json(test);
    } catch (error) {
        res.status(500).json({ message: "Error fetching test", error });
    }
};

// Retrieve questions for a test
export const getQuestionsForTest = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);
        if (!test) return res.status(404).json({ message: "Test not found" });
        const questions = await Question.find({ questionSetId: test.questionSetId });
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching questions for test", error });
    }
}

// Create a new test
export const createTest = async (req, res) => {
    try {
        const newTest = new Test(req.body);
        const savedTest = await newTest.save();
        res.status(201).json(savedTest);
    } catch (error) {
        res.status(400).json({ message: "Error creating test", error });
    }
};

// Update a test by ID
export const updateTest = async (req, res) => {
    try {
        const updatedTest = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTest) return res.status(404).json({ message: "Test not found" });
        res.status(200).json(updatedTest);
    } catch (error) {
        res.status(500).json({ message: "Error updating test", error });
    }
}

// Delete a test by ID
export const deleteTest = async (req, res) => {
    try {
        // Delete test results associated with the test
        await TestResult.deleteMany({ testId: req.params.id });
        // Delete the test
        const deletedTest = await Test.findByIdAndDelete(req.params.id);
        if (!deletedTest) return res.status(404).json({ message: "Test not found" });
        res.status(200).json({ message: "Test successfully deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting test", error });
    }
};


