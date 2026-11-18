"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Product_1 = __importDefault(require("../models/Product"));
const saveProduct = async (productData) => {
    const product = new Product_1.default(productData);
    return await product.save();
};
const getAllProducts = async () => {
    return await Product_1.default.find();
};
const getProductById = async (productId) => {
    return await Product_1.default.findById(productId);
};
const updateProduct = async (productId, productData) => {
    return await Product_1.default.findByIdAndUpdate(productId, productData, { new: true, runValidators: true });
};
const deleteProduct = async (productId) => {
    return await Product_1.default.findByIdAndDelete(productId);
};
exports.default = {
    saveProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
