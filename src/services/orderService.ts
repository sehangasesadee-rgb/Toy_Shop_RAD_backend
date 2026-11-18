import Order from "../models/Order";
import Product from "../models/Product";

interface OrderItemInput {
  productId: string;
  quantity: number;
}

interface OrderData {
  userId: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItemInput[];
}

type OrderStatus = "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED";

const createOrder = async (orderData: OrderData) => {
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
    totalPrice,
  });

  const savedOrder = await order.save();

  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity },
    });
  }

  return savedOrder;
};

const getMyOrders = async (userId: string) => {
  const orders = await Order.find({ userId })
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

const updateOrderStatus = async (
  orderId: string,
  orderStatus: OrderStatus
) => {
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

const getBestSellingProducts = async () => {
  const bestSellingProducts = await Order.aggregate([
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

export default {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getBestSellingProducts,
};
