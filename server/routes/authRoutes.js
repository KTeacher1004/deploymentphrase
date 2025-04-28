import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Logout
router.post("/logout", logoutUser);

// Auto login
router.get("/autologin", protect, (req, res) => {
    res.json({
        success: true,
        user: {
            _id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            isTeacher: req.user.isTeacher,
        }
    });
});

export default router;
