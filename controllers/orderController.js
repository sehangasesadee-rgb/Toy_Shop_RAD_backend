const orderService = require("../services/orderService");


const createOrder = async (req, res, next) => {
  try {
    const { customerName, phone, address, items } = req.body;

    if (!customerName || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "Please provide all customer details",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please add products to your cart",
      });
    }

    for (const item of items) {
      if (
        !item.productId ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid product or quantity",
        });
      }
    }

    const orderData = {...req.body,userId: req.user.userId,};
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

const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user.userId;

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

const getAllOrders = async (req, res, next) => {
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

const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const allowedStatuses = [
      "PENDING",
      "CONFIRMED",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
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

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
