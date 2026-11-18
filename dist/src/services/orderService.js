"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const createOrder = async (orderData) => {
    const orderItems = [];
    let totalPrice = 0;
    for (const item of orderData.items) {
        const product = await Product_1.default.findById(item.productId);
        if (!product) {
            throw new Error(`Product not found: ${item.productId}`);
        }
        if (product.stock < item.quantity) {
            throw new Error(`Not enough stock for ${product.name}. Available: ${product.stock}`);
        }
        orderItems.push({
            productId: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity: item.quantity,
        });
        totalPrice += product.price * item.quantity;
    }
    const order = new Order_1.default({
        userId: orderData.userId,
        customerName: orderData.customerName,
        phone: orderData.phone,
        address: orderData.address,
        items: orderItems,
        totalPrice,
    });
    const savedOrder = await order.save();
    for (const item of orderItems) {
        await Product_1.default.findByIdAndUpdate(item.productId, {
            $inc: { stock: -item.quantity },
        });
    }
    return savedOrder;
};
const getMyOrders = async (userId) => {
    const orders = await Order_1.default.find({ userId })
        .populate("items.productId", "image")
        .sort({ createdAt: -1 });
    return orders;
};
const getAllOrders = async () => {
    const orders = await Order_1.default.find()
        .populate("userId", "fullName email phone")
        .populate("items.productId", "image")
        .sort({ createdAt: -1 });
    return orders;
};
const updateOrderStatus = async (orderId, orderStatus) => {
    const order = await Order_1.default.findByIdAndUpdate(orderId, { orderStatus }, { new: true, runValidators: true });
    if (!order) {
        throw new Error("Order not found");
    }
    return order;
};
const getBestSellingProducts = async () => {
    const bestSellingProducts = await Order_1.default.aggregate([
        {
            $match: {
                orderStatus: "DELIVERED",
            },
        },
        {
            $unwind: "$items",
        },
        {
            $group: {
                _id: "$items.productId",
                name: { $first: "$items.name" },
                image: { $first: "$items.image" },
                price: { $first: "$items.price" },
                totalSold: { $sum: "$items.quantity" },
            },
        },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "productDetails",
            },
        },
        {
            $unwind: "$productDetails",
        },
        {
            $addFields: {
                category: "$productDetails.category",
                description: "$productDetails.description",
                stock: "$productDetails.stock",
            },
        },
        {
            $sort: {
                totalSold: -1,
            },
        },
        {
            $limit: 6,
        },
        {
            $project: {
                name: 1,
                image: 1,
                price: 1,
                category: 1,
                totalSold: 1,
                description: 1,
                stock: 1,
            },
        },
    ]);
    return bestSellingProducts;
};
exports.default = {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    getBestSellingProducts,
};
