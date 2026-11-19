import Payment from "../models/payment";
import Order from "../models/Order";

interface PaymentData {
  userId: string;
  orderId: string;
  paymentMethod: "CASH_ON_DELIVERY" | "BANK_TRANSFER";
}

const createPayment = async (data: PaymentData) => {
  const order = await Order.findOne({
    _id: data.orderId,
    userId: data.userId,
  });

  if (!order) {
    throw new Error("Order not found");
  }

  const existingPayment = await Payment.findOne({
    orderId: data.orderId,
  });

  if (existingPayment) {
    throw new Error("Payment already exists for this order");
  }

  const payment = new Payment({
    orderId: data.orderId,
    userId: data.userId,
    amount: order.totalPrice,
    paymentMethod: data.paymentMethod,
    paymentStatus: "PENDING",
  });

  return await payment.save();
};

const getMyPayments = async (userId: string) => {
  return await Payment.find({ userId })
    .populate("orderId")
    .sort({ createdAt: -1 });
};

const getAllPayments = async () => {
  return await Payment.find()
    .populate("userId", "fullName email")
    .populate("orderId")
    .sort({ createdAt: -1 });
};


const verifyBankTransfer = async (paymentId: string) => {
  const payment = await Payment.findById(paymentId);

  if (!payment) throw new Error("Payment not found");

  if (payment.paymentMethod !== "BANK_TRANSFER") {
    throw new Error("Only bank transfer payments can be verified");
  }

  if (payment.paymentStatus !== "PENDING") {
    throw new Error("This payment is already processed");
  }

  
  const order = await Order.findById(payment.orderId);

  if (!order) throw new Error("Order not found");


  payment.paymentStatus = "PAID";
  payment.verifiedAt = new Date();

 
  order.orderStatus = "CONFIRMED";

  await order.save();

  return await payment.save();
};

const markCashOnDeliveryAsPaid = async (paymentId: string) => {
  const payment = await Payment.findById(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.paymentMethod !== "CASH_ON_DELIVERY") {
    throw new Error("Only Cash on Delivery payments can be collected");
  }

  if (payment.paymentStatus !== "PENDING") {
    throw new Error("This payment is already processed");
  }

  payment.paymentStatus = "PAID";
  payment.verifiedAt = new Date();

  return await payment.save();
};

const uploadPaymentSlip = async (
  paymentId: string,
  userId: string,
  fileName: string
) => {
  const payment = await Payment.findOne({
    _id: paymentId,
    userId,
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.paymentMethod !== "BANK_TRANSFER") {
    throw new Error("Bank slip is only required for bank transfers");
  }

  if (payment.paymentStatus !== "PENDING") {
    throw new Error("Only pending payments can upload a bank slip");
  }

  payment.bankSlip = fileName;

  return await payment.save();
};



const getBankSlip = async (paymentId: string) => {
  const payment = await Payment.findById(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.paymentMethod !== "BANK_TRANSFER") {
    throw new Error("This payment is not a bank transfer");
  }

  if (!payment.bankSlip) {
    throw new Error("Bank slip not uploaded yet");
  }

  return payment.bankSlip;
};


export default {
  createPayment,
  getMyPayments,
  getAllPayments,
  verifyBankTransfer,
  markCashOnDeliveryAsPaid,
  uploadPaymentSlip,
  getBankSlip,
  
  
};
