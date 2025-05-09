import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// Register a new user
export const registerUser = async (req, res) => {
    // Get variables from request body
    const { username, email, password, isTeacher } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }
    
    // Create new user
    const user = await User.create({ username, email, password, isTeacher });
    return res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isTeacher: user.isTeacher,
    });
};

// Login a user
export const loginUser = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            const token = generateToken(res, user._id, rememberMe);
            return res.json({ 
                user: { _id: user._id, username: user.username, email: user.email, isTeacher: user.isTeacher },
                token: rememberMe ? undefined : token
            });
        } 
        return res.status(401).json({ message: "Invalid email or password" });
    } catch (error) {
        console.error("Login error:", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
};

// Logout user
export const logoutUser = (req, res) => {
    res.cookie("jwt", "", { 
        httpOnly: true, 
        expires: new Date(0) 
    });

    res.json({ message: "Logged out successfully" });
};
