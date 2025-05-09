import jwt from "jsonwebtoken";

const generateToken = (res, userId, rememberMe = false) => {
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    console.log("userId:", userId);
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });

    if (rememberMe) {
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            path: "/"
        });
    }
    return token;
};

export default generateToken;