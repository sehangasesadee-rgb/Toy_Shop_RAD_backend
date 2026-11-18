"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orderService_1 = __importDefault(require("../services/orderService"));
const createOrder = async (req, res, next) => {
    try {
        const { customerName, phone, address, items } = req.body;
        if (!customerName || !phone || !address) {
            res.status(400).json({
                success: false,
                message: "Please provide all customer details",
            });
            return;
        }
        if (!Array.isArray(items) || items.length === 0) {
            res.status(400).json({
                success: false,
                message: "Please add products to your cart",
            });
            return;
        }
        for (const item of items) {
            if (!item.productId ||
                !Number.isInteger(item.quantity) ||
                item.quantity < 1) {
                res.status(400).json({
                    success: false,
                    message: "Invalid product or quantity",
                });
                return;
            }
        }
        const orderData = {
            ...req.body,
            userId: req.user.userId,
        };
        const order = await orderService_1.default.createOrder(orderData);
        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: order,
        });
    }
    catch (error) {
        next(error);
    }
};
const getMyOrders = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const orders = await orderService_1.default.getMyOrders(userId);
        res.status(200).json({
            success: true,
            message: "My orders retrieved successfully",
            data: orders,
        });
    }
    catch (error) {
        next(error);
    }
};
const getAllOrders = async (req, res, next) => {
    try {
        const orders = await orderService_1.default.getAllOrders();
        res.status(200).json({
            success: true,
            message: "All orders retrieved successfully",
            data: orders,
        });
    }
    catch (error) {
        next(error);
    }
};
const updateOrderStatus = async (req, res, next) => {
    try {
        const orderId = req.params.orderId;
        const { orderStatus } = req.body;
        const allowedStatuses = [
            "PENDING",
            "CONFIRMED",
            "DELIVERED",
            "CANCELLED",
        ];
        if (!allowedStatuses.includes(orderStatus)) {
            res.status(400).json({
                success: false,
                message: "Invalid order status",
            });
            return;
        }
        const order = await orderService_1.default.updateOrderStatus(orderId, orderStatus);
        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: order,
        });
    }
    catch (error) {
        next(error);
    }
};
const getBestSellingProducts = async (req, res, next) => {
    try {
        const products = await orderService_1.default.getBestSellingProducts();
        res.status(200).json({
            success: true,
            message: "Best-selling products retrieved successfully",
            data: products,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    getBestSellingProducts,
};
