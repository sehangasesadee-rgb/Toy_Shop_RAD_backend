"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productService_1 = __importDefault(require("../services/productService"));
// import sendResponse from "../../utils/response";
const saveProduct = async (req, res, next) => {
    try {
        const savedProduct = await productService_1.default.saveProduct(req.body);
        sendResponse(res, 201, "Product saved successfully", savedProduct);
    }
    catch (error) {
        next(error);
    }
};
const getAllProducts = async (req, res, next) => {
    try {
        const products = await productService_1.default.getAllProducts();
        sendResponse(res, 200, "Products retrieved successfully", products);
    }
    catch (error) {
        next(error);
    }
};
const getProductById = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const product = await productService_1.default.getProductById(productId);
        if (!product) {
            res.status(404).json({
                success: false,
                message: "Product not found",
            });
            return;
        }
        sendResponse(res, 200, "Product retrieved successfully", product);
    }
    catch (error) {
        next(error);
    }
};
const updateProduct = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const updatedProduct = await productService_1.default.updateProduct(productId, req.body);
        if (!updatedProduct) {
            res.status(404).json({
                success: false,
                message: "Product not found",
            });
            return;
        }
        sendResponse(res, 200, "Product updated successfully", updatedProduct);
    }
    catch (error) {
        next(error);
    }
};
const deleteProduct = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await productService_1.default.deleteProduct(productId);
        if (!deletedProduct) {
            res.status(404).json({
                success: false,
                message: "Product not found",
            });
            return;
        }
        sendResponse(res, 200, "Product deleted successfully", deletedProduct);
    }
    catch (error) {
        next(error);
    }
};
const sendResponse = (res, statusCode, message, data) => {
    res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};
exports.default = {
    saveProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
