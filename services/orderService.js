const Order = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (orderData) => {
  const orderItems = [];
  let totalPrice = 0;

  for (const item of orderData.items) {
    const product = await Product.findById(item.productId);

    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    if (product.stock < item.quantity) {
      throw new Error(
        `Not enough stock for ${product.name}. Available: ${product.stock}`
      );
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

  const order = new Order({
    userId: orderData.userId,
    customerName: orderData.customerName,
    phone: orderData.phone,
    address: orderData.address,
    items: orderItems,
    totalPrice: totalPrice,
  });

  const savedOrder = await order.save();

  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity },
    });
  }

  return savedOrder;
};

const getMyOrders = async (userId) => {
  const orders = await Order.find({ userId: userId })
    .populate("items.productId", "image")
    .sort({ createdAt: -1 });

  return orders;
};

const getAllOrders = async () => {
  const orders = await Order.find()
    .populate("userId", "fullName email phone")
    .populate("items.productId", "image")
    .sort({ createdAt: -1 });

  return orders;
};

const updateOrderStatus = async (orderId, orderStatus) => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus },
    { new: true, runValidators: true }
  );

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
