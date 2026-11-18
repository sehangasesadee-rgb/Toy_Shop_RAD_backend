import { Router } from "express";
import seasonController from "../controllers/seasonController";
import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";
import uploadSeasonBanner from "../middleware/uploadMiddleware";

const router = Router();

router.get("/active", seasonController.getActiveSeasons);

router.get("/", authMiddleware, adminMiddleware, seasonController.getAllSeasons);

router.post("/",authMiddleware,adminMiddleware,uploadSeasonBanner.single("bannerImage"),seasonController.createSeason);

router.put("/:id",authMiddleware,adminMiddleware,uploadSeasonBanner.single("bannerImage"),seasonController.updateSeason);
router.patch("/:id/status", authMiddleware, adminMiddleware, seasonController.changeSeasonStatus);

router.delete("/:id", authMiddleware, adminMiddleware, seasonController.deleteSeason);

router.get("/:id/products", seasonController.getSeasonProducts);

router.post("/:id/products", authMiddleware, adminMiddleware, seasonController.addProductsToSeason);

router.put("/:id/products/:offerId", authMiddleware, adminMiddleware, seasonController.updateSeasonProductPrice);

router.delete("/:id/products/:offerId", authMiddleware, adminMiddleware, seasonController.removeProductFromSeason);

export default router;
