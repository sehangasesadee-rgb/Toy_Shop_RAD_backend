import { Router } from "express";
import offerController from "../controllers/offerController";
import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";

const router = Router();

router.get("/daily", offerController.getDailyOffers);

router.get("/seasonal", offerController.getSeasonalOffers);

router.post(
  "/seasonal",
  authMiddleware,
  adminMiddleware,
  offerController.createSeasonalOffers
);

router.delete(
  "/seasonal/:id",
  authMiddleware,
  adminMiddleware,
  offerController.deleteSeasonalOffer
);

export default router;
