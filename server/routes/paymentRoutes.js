import express from "express";
import protect from "../middlewares/protect.js";
import authorizeRole from "../middlewares/authorizeRole.js";
import { createPayment, getOrderPayments, updatePaymentStatus } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create", protect, authorizeRole(["student"]), createPayment);
router.get("/order/:orderId", protect, authorizeRole(["student"]), getOrderPayments);
router.patch("/:paymentId/status", protect, authorizeRole(["student"]), updatePaymentStatus);

export default router;