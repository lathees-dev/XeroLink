import express from "express";
import { createPayment, getOrderPayments, updatePaymentStatus } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create", createPayment);
router.get("/order/:orderId", getOrderPayments);
router.patch("/:paymentId/status", updatePaymentStatus);

export default router;