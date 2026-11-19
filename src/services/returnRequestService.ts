import ReturnRequest from "../models/returnRequest";
import Order from "../models/Order";

interface ReturnRequestData {
  userId: string;
  orderId: string;
  productId: string;
  quantity: number;
  reason: string;
  details: string;
  image?: string;
}

const createReturnRequest = async (data: ReturnRequestData) => {
  const order = await Order.findOne({
    _id: data.orderId,
    userId: data.userId,
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.orderStatus !== "DELIVERED") {
    throw new Error("Only delivered orders can be returned");
  }

  const orderItem = order.items.find(
    (item: any) => item.productId.toString() === data.productId
  );

  if (!orderItem) {
    throw new Error("Selected product not found in this order");
  }

  if (
    !Number.isInteger(data.quantity) ||
    data.quantity < 1 ||
    data.quantity > orderItem.quantity
  ) {
    throw new Error("Invalid return quantity");
  }

  const existingRequest = await ReturnRequest.findOne({
    orderId: data.orderId,
    userId: data.userId,
    productId: data.productId,
    status: { $in: ["PENDING", "APPROVED"] },
  });

  if (existingRequest) {
    throw new Error("A return request already exists for this product");
  }

  const returnRequest = new ReturnRequest({
    userId: data.userId,
    orderId: data.orderId,
    productId: data.productId,
    quantity: data.quantity,
    reason: data.reason,
    details: data.details,
    image: data.image,
  });

  return await returnRequest.save();
};

const getMyReturnRequests = async (userId: string) => {
  return await ReturnRequest.find({ userId })
    .populate("orderId")
    .populate("productId")
    .sort({ createdAt: -1 });
};

const getAllReturnRequests = async () => {
  return await ReturnRequest.find()
    .populate("userId", "fullName email")
    .populate("orderId")
    .populate("productId")
    .sort({ createdAt: -1 });
};

const updateReturnRequestStatus = async (
  requestId: string,
  status: "APPROVED" | "REJECTED"
) => {
  const request = await ReturnRequest.findByIdAndUpdate(
    requestId,
    { status },
    { returnDocument: "after", runValidators: true }
  );

  if (!request) {
    throw new Error("Return request not found");
  }

  return request;
};

export default {
  createReturnRequest,
  getMyReturnRequests,
  getAllReturnRequests,
  updateReturnRequestStatus,
};
