
const productService = require("../services/productService");
const sendResponse = require("../utils/response");

const saveProduct = async (req, res, next) => {
  try {
    const savedProduct = await productService.saveProduct(req.body);
    sendResponse(res,201,"Product saved successfully",savedProduct);
  } catch (error) {
    next(error);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();

    sendResponse(res, 200, "Products retrieved successfully", products);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    sendResponse(res, 200, "Product retrieved successfully", product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await productService.updateProduct(
      req.params.id,
      req.body
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    sendResponse(res, 200, "Product updated successfully", updatedProduct);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const deletedProduct = await productService.deleteProduct(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    sendResponse(res, 200, "Product deleted successfully", deletedProduct);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
