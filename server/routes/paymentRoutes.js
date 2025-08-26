import express from "express";
import protect from "../middlewares/protect.js";
import authorizeRole from "../middlewares/authorizeRole.js";
import { validateOrder } from "../middlewares/validateOrder.js";
import { validateStatusUpdate } from "../middlewares/validateStatusUpdate.js";
import { createPayment, getOrderPayments, updatePaymentStatus } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create", protect, authorizeRole(["student"]), validateOrder, createPayment);
router.get("/order/:orderId", protect, authorizeRole(["student"]), getOrderPayments);
router.patch(
  "/:paymentId/status",
  protect,
  authorizeRole(["student"]),
  validateStatusUpdate(["pending", "success", "failed", "refunded"]),
  updatePaymentStatus
);

export default router;