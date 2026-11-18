
import { Request, Response, NextFunction } from "express";

import productService from "../services/productService";
// import sendResponse from "../../utils/response";

const saveProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const savedProduct = await productService.saveProduct(req.body);
    sendResponse(res, 201, "Product saved successfully", savedProduct);
  } catch (error) {
    next(error);
  }
};


const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ageRange = req.query.ageRange as string | undefined;

    const products = await productService.getAllProducts(ageRange);

    sendResponse(res, 200, "Products retrieved successfully", products);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const productId = req.params.id as string;
    const product = await productService.getProductById(productId);

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    sendResponse(res, 200, "Product retrieved successfully", product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const productId = req.params.id as string;

    const updatedProduct = await productService.updateProduct(
        productId,
        req.body
    );

    if (!updatedProduct) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    sendResponse(res, 200, "Product updated successfully", updatedProduct);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const productId = req.params.id as string;
    const deletedProduct = await productService.deleteProduct(productId);

    if (!deletedProduct) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    sendResponse(res, 200, "Product deleted successfully", deletedProduct);
  } catch (error) {
    next(error);
  }
};

const sendResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: unknown
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export default {
  saveProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
