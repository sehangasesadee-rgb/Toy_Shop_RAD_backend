import { Router } from "express";

import orderController from "../controllers/orderController";
import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  (req, res, next) => {
    if ((req as any).user?.role !== "CUSTOMER") {
      return res.status(403).json({
        success: false,
        message: "Only customers can place orders",
      });
    }

    next();
  },
  orderController.createOrder
);

router.get(
  "/best-selling",
  orderController.getBestSellingProducts
);

router.get("/my-orders", authMiddleware, orderController.getMyOrders);

router.get(
  "/all",
  authMiddleware,
  adminMiddleware,
  orderController.getAllOrders
);

router.patch(
  "/:orderId/status",
  authMiddleware,
  adminMiddleware,
  orderController.updateOrderStatus
);

export default router;
