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
        // Check if user exists
        const user = await User.findOne({ email });
        // Check if user exists and password is correct
        if (user && (await user.matchPassword(password))) {
            // if rememberMe is true, set token expiration to 30 days
            if (rememberMe) {
                generateToken(res, user._id, true);
            }
            // if rememberMe is false, set token expiration to session
            else {
                generateToken(res, user._id);
            }
            return res.json({ _id: user._id, username: user.username, email: user.email, isTeacher: user.isTeacher });
        } 
        return res.status(401).json({ message: "Invalid email or password" });
    } catch (error) {
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
