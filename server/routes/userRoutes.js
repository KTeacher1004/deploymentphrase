import express from "express";
import { findUser, getUsersByIds } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Find user by username or email
router.get("/find", findUser);

// Get multiple users by their IDs
router.get("/students", getUsersByIds);

export default router; 