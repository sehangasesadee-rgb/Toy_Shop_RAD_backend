import { Router } from "express";

import returnRequestController from "../controllers/returnRequestController";
import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";

console.log("Auth:", typeof authMiddleware);
console.log("Admin:", typeof adminMiddleware);
console.log("Controller:", typeof returnRequestController);
console.log("Create:", typeof returnRequestController.createReturnRequest);
console.log("My Requests:", typeof returnRequestController.getMyReturnRequests);
console.log("All Requests:", typeof returnRequestController.getAllReturnRequests);
console.log("Update Status:", typeof returnRequestController.updateReturnRequestStatus);

console.log("authMiddleware:", typeof authMiddleware);
console.log("adminMiddleware:", typeof adminMiddleware);
console.log(
  "createReturnRequest:",
  typeof returnRequestController.createReturnRequest
);

const router = Router();


router.post(
  "/",
  authMiddleware,
  (req, res, next) => {
    if ((req as any).user?.role !== "CUSTOMER") {
      return res.status(403).json({
        success: false,
        message: "Only customers can submit return requests",
      });
    }

    next();
  },
  returnRequestController.createReturnRequest
);

router.get(
  "/my-requests",
  authMiddleware,
  returnRequestController.getMyReturnRequests
);

router.get(
  "/all",
  authMiddleware,
  adminMiddleware,
  returnRequestController.getAllReturnRequests
);

router.patch(
  "/:requestId/status",
  authMiddleware,
  adminMiddleware,
  returnRequestController.updateReturnRequestStatus
);

export default router;
