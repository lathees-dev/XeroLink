import express from "express";
import protect from "./../middlewares/protect.js";
import authorizeRole from "../middlewares/authorizeRole.js";
import { validateOrder } from "../middlewares/validateOrder.js";
import {
  createOrder,
  getUserOrders,
  deleteOrder,
  getOrderDetails,
  updateOrderStatus,
  cancelOrder,
  leaveOrderFeedback,
} from "../controllers/orderController.js";
import upload from "../config/multer.js";

const router = express.Router();

router.post("/create", protect, authorizeRole(["student"]), upload.single("document"), validateOrder, createOrder);
router.post("/:orderId/feedback", protect, authorizeRole(["student"]), leaveOrderFeedback);
router.get("/", protect, authorizeRole(["student"]), getUserOrders);
router.get("/:orderId", protect, authorizeRole(["student"]), getOrderDetails);
router.patch("/:orderId/status", protect, authorizeRole(["shop"]), updateOrderStatus);
router.delete("/:orderId", protect, authorizeRole(["student","shop"]), cancelOrder);
router.delete("/:id", protect, authorizeRole(["student"]), deleteOrder);

export default router;
