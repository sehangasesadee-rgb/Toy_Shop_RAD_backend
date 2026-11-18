import { Router } from "express";

import validateProduct from "../validators/productValidator";
import productController from "../controllers/productController";
import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";

const router = Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validateProduct,
  productController.saveProduct
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateProduct,
  productController.updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  productController.deleteProduct
);

export default router;