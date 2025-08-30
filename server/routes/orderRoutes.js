import express from "express";
import protect from "./../middlewares/protect.js";
import authorizeRole from "../middlewares/authorizeRole.js";
import { validateOrder } from "../middlewares/validateOrder.js";
import upload from "../config/multer.js";
import {
  createOrder,
  getUserOrders,
  getOrderDetails,
  updateOrderStatus,
  cancelOrder,
  leaveOrderFeedback,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/create", protect, authorizeRole(["student"]), upload.array("document", 5), validateOrder, createOrder);
router.post("/:orderId/feedback", protect, authorizeRole(["student"]), leaveOrderFeedback);
router.get("/", protect, authorizeRole(["student"]), getUserOrders);
router.get("/:orderId", protect, authorizeRole(["student"]), getOrderDetails);
router.patch("/:orderId/status", protect, authorizeRole(["shop"]), updateOrderStatus);
router.delete("/:orderId", protect, authorizeRole(["student","shop"]), cancelOrder);
router.delete("/:id", protect, authorizeRole(["student"]), deleteOrder);

export default router;
