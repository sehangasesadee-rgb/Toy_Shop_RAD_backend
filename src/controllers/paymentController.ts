import { Request, Response, NextFunction } from "express";
import paymentService from "../services/paymentService";
import uploadPaymentSlipMiddleware from "../middleware/uploadPaymentSlip";
import path from "path";
import fs from "fs";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role?: string;
  };
}

const createPayment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId, paymentMethod } = req.body;

    if (
      !orderId ||
      !["CASH_ON_DELIVERY", "BANK_TRANSFER"].includes(paymentMethod)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid orderId and paymentMethod",
      });
    }

    const payment = await paymentService.createPayment({
      userId: req.user!.userId,
      orderId,
      paymentMethod,
    });

    return res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

const getMyPayments = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const payments = await paymentService.getMyPayments(
      req.user!.userId
    );

    return res.status(200).json({
      success: true,
      message: "My payments retrieved successfully",
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payments = await paymentService.getAllPayments();

    return res.status(200).json({
      success: true,
      message: "All payments retrieved successfully",
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

const verifyBankTransfer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paymentId = String(req.params.paymentId);

    const payment = await paymentService.verifyBankTransfer(paymentId);

    return res.status(200).json({
      success: true,
      message: "Bank transfer verified successfully",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

const markCashOnDeliveryAsPaid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paymentId = String(req.params.paymentId);

    const payment =
      await paymentService.markCashOnDeliveryAsPaid(paymentId);

    return res.status(200).json({
      success: true,
      message: "Cash on Delivery payment marked as paid",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

const uploadPaymentSlip = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const paymentId = String(req.params.paymentId);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a bank payment slip",
      });
    }

    const payment = await paymentService.uploadPaymentSlip(
      paymentId,
      req.user!.userId,
      req.file.filename
    );

    return res.status(200).json({
      success: true,
      message: "Bank payment slip uploaded successfully",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};
const viewBankSlip = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paymentId = String(req.params.paymentId);

    const fileName = await paymentService.getBankSlip(paymentId);

    const safeFileName = path.basename(fileName);
    const filePath = path.resolve(
      process.cwd(),
      "uploads",
      "payments",
      safeFileName
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Bank slip file not found",
      });
    }

    return res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
};

export default {
  createPayment,
  getMyPayments,
  getAllPayments,
  verifyBankTransfer,
  markCashOnDeliveryAsPaid,
  uploadPaymentSlip,
  viewBankSlip,
};
