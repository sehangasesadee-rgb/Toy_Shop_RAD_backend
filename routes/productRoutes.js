
const express = require("express");
const router = express.Router();

const validateProduct = require("../validators/productValidator");
const productController = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

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

module.exports = router;
