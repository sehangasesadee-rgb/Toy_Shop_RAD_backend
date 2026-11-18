"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const registerUser = async (userData) => {
    const existingUser = await User_1.default.findOne({
        email: userData.email,
    });
    if (existingUser) {
        throw new Error("Email already registered");
    }
    const hashedPassword = await bcryptjs_1.default.hash(userData.password, 10);
    const user = new User_1.default({
        fullName: userData.fullName,
        email: userData.email,
        password: hashedPassword,
        phone: userData.phone,
    });
    return await user.save();
};
const loginUser = async (email, password) => {
    const user = await User_1.default.findOne({ email });
    if (!user) {
        throw new Error("Invalid email or password");
    }
    const isPasswordCorrect = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new Error("Invalid email or password");
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined");
    }
    const token = jsonwebtoken_1.default.sign({
        userId: user._id.toString(),
        role: user.role,
    }, jwtSecret, {
        expiresIn: "1d",
    });
    return {
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role,
        },
        token,
    };
};
const getUserProfile = async (userId) => {
    const user = await User_1.default.findById(userId).select("-password");
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};
const updateUserProfile = async (userId, profileData) => {
    const user = await User_1.default.findByIdAndUpdate(userId, {
        fullName: profileData.fullName,
        phone: profileData.phone,
    }, {
        new: true,
        runValidators: true,
    }).select("-password");
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};
exports.default = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
};
