"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = __importDefault(require("../controllers/orderController"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const adminMiddleware_1 = __importDefault(require("../middleware/adminMiddleware"));
const router = (0, express_1.Router)();
router.post("/", authMiddleware_1.default, (req, res, next) => {
    if (req.user?.role !== "CUSTOMER") {
        return res.status(403).json({
            success: false,
            message: "Only customers can place orders",
        });
    }
    next();
}, orderController_1.default.createOrder);
router.get("/best-selling", orderController_1.default.getBestSellingProducts);
router.get("/my-orders", authMiddleware_1.default, orderController_1.default.getMyOrders);
router.get("/all", authMiddleware_1.default, adminMiddleware_1.default, orderController_1.default.getAllOrders);
router.patch("/:orderId/status", authMiddleware_1.default, adminMiddleware_1.default, orderController_1.default.updateOrderStatus);
exports.default = router;
