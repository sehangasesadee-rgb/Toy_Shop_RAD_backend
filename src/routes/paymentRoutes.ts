import { Router } from "express";

import paymentController from "../controllers/paymentController";
import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";
import uploadPaymentSlip from "../middleware/uploadPaymentSlip";
const router = Router();

router.post(
  "/",
  authMiddleware,
  (req, res, next) => {
    if ((req as any).user?.role !== "CUSTOMER") {
      return res.status(403).json({
        success: false,
        message: "Only customers can create payments",
      });
    }

    next();
  },
  paymentController.createPayment
);

router.get(
  "/my-payments",
  authMiddleware,
  paymentController.getMyPayments
);

router.get(
  "/all",
  authMiddleware,
  adminMiddleware,
  paymentController.getAllPayments
);

router.patch(
  "/:paymentId/verify",
  authMiddleware,
  adminMiddleware,
  paymentController.verifyBankTransfer
);

router.patch(
  "/:paymentId/collect-cash",
  authMiddleware,
  adminMiddleware,
  paymentController.markCashOnDeliveryAsPaid
);

router.post(
  "/:paymentId/upload-slip",
  authMiddleware,
  uploadPaymentSlip.single("bankSlip"),
  paymentController.uploadPaymentSlip
);

router.get(
  "/:paymentId/slip",
  authMiddleware,
  adminMiddleware,
  paymentController.viewBankSlip
);

export default router;
