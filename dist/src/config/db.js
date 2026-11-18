"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        await mongoose_1.default.connect(mongoURI);
        console.log("MongoDB connected successfully!");
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Database connection failed:", error.message);
        }
        else {
            console.error("Database connection failed:", error);
        }
        process.exit(1);
    }
};
exports.default = connectDB;
