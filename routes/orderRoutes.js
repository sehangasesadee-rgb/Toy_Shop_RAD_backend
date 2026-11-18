const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/",  authMiddleware , orderController.createOrder);
router.get("/my-orders", authMiddleware, orderController.getMyOrders);
router.get("/all",authMiddleware,adminMiddleware,orderController.getAllOrders);
router.patch("/:orderId/status",authMiddleware,adminMiddleware,orderController.updateOrderStatus);

module.exports = router;
