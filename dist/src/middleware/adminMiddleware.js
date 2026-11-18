"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== "ADMIN") {
        res.status(403).json({
            success: false,
            message: "Access denied. Admin only.",
        });
        return;
    }
    next();
};
exports.default = adminMiddleware;
