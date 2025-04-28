import User from "../models/userModel.js";

// Find user by username or email
export const findUser = async (req, res) => {
    try {
        const { username, email, isTeacher } = req.query;
        
        // Build query based on provided parameters
        const query = {};
        if (username) query.username = username;
        if (email) query.email = email;
        if (isTeacher !== undefined) query.isTeacher = isTeacher === 'true';
        // Find user
        const user = await User.findOne(query).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).json({ message: "Error finding user", error: error.message });
    }
};

// Get multiple users by their IDs
export const getUsersByIds = async (req, res) => {
    try {
        const { ids } = req.query;
        
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ message: "Invalid user IDs provided" });
        }

        const users = await User.find({ _id: { $in: ids } }).select('-password');
        
        res.status(200).json(users);
    } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).json({ message: "Error getting users", error: error.message });
    }
}; 