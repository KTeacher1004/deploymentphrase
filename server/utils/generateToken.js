import jwt from "jsonwebtoken";

const generateToken = (res, userId, rememberMe = false) => {
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    console.log("userId:", userId);
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });

    if (rememberMe) {
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: "/"
        });
    }
    return token;
};

export default generateToken;