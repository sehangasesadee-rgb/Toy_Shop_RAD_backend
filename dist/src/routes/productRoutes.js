"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productValidator_1 = __importDefault(require("../validators/productValidator"));
const productController_1 = __importDefault(require("../controllers/productController"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const adminMiddleware_1 = __importDefault(require("../middleware/adminMiddleware"));
const router = (0, express_1.Router)();
router.get("/", productController_1.default.getAllProducts);
router.get("/:id", productController_1.default.getProductById);
router.post("/", authMiddleware_1.default, adminMiddleware_1.default, productValidator_1.default, productController_1.default.saveProduct);
router.put("/:id", authMiddleware_1.default, adminMiddleware_1.default, productValidator_1.default, productController_1.default.updateProduct);
router.delete("/:id", authMiddleware_1.default, adminMiddleware_1.default, productController_1.default.deleteProduct);
exports.default = router;
