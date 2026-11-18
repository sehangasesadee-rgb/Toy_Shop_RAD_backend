"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateProduct = (req, res, next) => {
    const { name, description, price, category, image, stock } = req.body;
    if (!name ||
        !description ||
        price === undefined ||
        !category ||
        !image) {
        res.status(400).json({
            success: false,
            message: "Please provide all required product fields",
        });
        return;
    }
    if (typeof price !== "number" || price < 0) {
        res.status(400).json({
            success: false,
            message: "Price must be a non-negative number",
        });
        return;
    }
    if (stock !== undefined &&
        (typeof stock !== "number" || stock < 0)) {
        res.status(400).json({
            success: false,
            message: "Stock must be a non-negative number",
        });
        return;
    }
    next();
};
exports.default = validateProduct;
