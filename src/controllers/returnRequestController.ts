import { Request, Response, NextFunction } from "express";
import returnRequestService from "../services/returnRequestService";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role?: string;
  };
}

const createReturnRequest = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId, productId, quantity, reason, details, image } = req.body;

    if (
      !orderId ||
      !productId ||
      quantity === undefined ||
      !reason ||
      !details ||
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid required fields",
      });
    }

    const returnRequest = await returnRequestService.createReturnRequest({
      userId: req.user!.userId,
      orderId,
      productId,
      quantity: Number(quantity),
      reason,
      details,
      image,
    });

    return res.status(201).json({
      success: true,
      message: "Return request submitted successfully",
      data: returnRequest,
    });
  } catch (error) {
    next(error);
  }
};

const getMyReturnRequests = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const requests = await returnRequestService.getMyReturnRequests(
      req.user!.userId
    );

    return res.status(200).json({
      success: true,
      message: "Return requests retrieved successfully",
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

const getAllReturnRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requests = await returnRequestService.getAllReturnRequests();

    return res.status(200).json({
      success: true,
      message: "All return requests retrieved successfully",
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

const updateReturnRequestStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.body;
    const requestId = String(req.params.requestId);

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be APPROVED or REJECTED",
      });
    }

    const updatedRequest =
      await returnRequestService.updateReturnRequestStatus(
        requestId,
        status
      );

    return res.status(200).json({
      success: true,
      message: "Return request status updated successfully",
      data: updatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createReturnRequest,
  getMyReturnRequests,
  getAllReturnRequests,
  updateReturnRequestStatus,
};