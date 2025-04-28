import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    isTeacher: {type: Boolean, default: false},
});

// Automation method to hash password before save to database
userSchema.pre("save", async function (next) {
    // Check if password is modified or not exist to avoid rehashing
    if (!this.isModified("password") || !this) {
        next();
    }

    try {
        // hash the password with a salt
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next
    } catch (error) {
        next(error);
    }
});

// Compare password method for login
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;