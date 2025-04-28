import express from 'express';
import { 
    getTestResultsByStudent, 
    submitTestResult, 
    getTestResultsByTest,
    getTestResultById
} from '../controllers/testResultController.js';

const router = express.Router();

// Get test results for a student
router.get('/student/:studentId', getTestResultsByStudent);

// Submit test results
router.post('/submit', submitTestResult);

// Get test results for a specific test
router.get('/:testId/results', getTestResultsByTest);

// Get test result by ID
router.get('/:id', getTestResultById);


export default router; 