import { Request, Response, NextFunction } from "express";

import orderService from "../services/orderService";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

const createOrder = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
      if (
        !item.productId ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        res.status(400).json({
          success: false,
          message: "Invalid product or quantity",
        });
        return;
      }
    }

    const orderData = {
      ...req.body,
      userId: req.user!.userId,
    };

    const order = await orderService.createOrder(orderData);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const orders = await orderService.getMyOrders(userId);

    res.status(200).json({
      success: true,
      message: "My orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orders = await orderService.getAllOrders();

    res.status(200).json({
      success: true,
      message: "All orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orderId = req.params.orderId as string;
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

    const order = await orderService.updateOrderStatus(
      orderId,
      orderStatus
    );

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

const getBestSellingProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const products = await orderService.getBestSellingProducts();

    res.status(200).json({
      success: true,
      message: "Best-selling products retrieved successfully",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getBestSellingProducts,
};
