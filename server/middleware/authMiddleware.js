import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
    let token;

    // Get token from cookies or headers
    if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    // If token doesn't exist
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        // Decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by id
        req.user = await User.findById(decoded.userId).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }
        // Pass user to next middleware
        next();
    } catch (error) {
        // If token is invalid
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired, please login again" });
        }
        res.status(401).json({ message: "Not authorized, invalid token" });
    }
};
