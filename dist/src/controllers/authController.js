"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authService_1 = __importDefault(require("../services/authService"));
const register = async (req, res, next) => {
    try {
        const { fullName, email, password, phone } = req.body;
        if (!fullName || !email || !password || !phone) {
            res.status(400).json({
                success: false,
                message: "Please provide all required details",
            });
            return;
        }
        if (typeof email !== "string") {
            res.status(400).json({
                success: false,
                message: "Email must be text",
            });
            return;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailPattern.test(email.trim())) {
            res.status(400).json({
                success: false,
                message: "Please enter a valid email address",
            });
            return;
        }
        if (typeof password !== "string" || password.length < 6) {
            res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters",
            });
            return;
        }
        const user = await authService_1.default.registerUser(req.body);
        res.status(201).json({
            success: true,
            message: "Registration successful",
            data: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
            },
        });
    }
    catch (error) {
        if (error instanceof Error &&
            error.message === "Email already registered") {
            res.status(409).json({
                success: false,
                message: error.message,
            });
            return;
        }
        next(error);
    }
};
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
            return;
        }
        if (typeof email !== "string" || typeof password !== "string") {
            res.status(400).json({
                success: false,
                message: "Email and password must be text",
            });
            return;
        }
        const result = await authService_1.default.loginUser(email, password);
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    }
    catch (error) {
        if (error instanceof Error &&
            error.message === "Invalid email or password") {
            res.status(401).json({
                success: false,
                message: error.message,
            });
            return;
        }
        next(error);
    }
};
const getProfile = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }
        const user = await authService_1.default.getUserProfile(userId);
        res.status(200).json({
            success: true,
            message: "Profile retrieved successfully",
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
};
const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const { fullName, phone } = req.body;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }
        if (!fullName || !phone) {
            res.status(400).json({
                success: false,
                message: "Name and phone are required",
            });
            return;
        }
        const user = await authService_1.default.updateUserProfile(userId, {
            fullName,
            phone,
        });
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    register,
    login,
    getProfile,
    updateProfile,
};
