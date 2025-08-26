import express from "express";
import protect from "./../middlewares/protect.js";
import authorizeRole from "../middlewares/authorizeRole.js";
import { validateOrder } from "../middlewares/validateOrder.js";
import {
  createOrder,
  getUserOrders,
  deleteOrder,
} from "../controllers/orderController.js";
import upload from "../config/multer.js";

const router = express.Router();

router.post("/create", protect, authorizeRole(["student"]), upload.single("document"), validateOrder, createOrder);
router.get("/", protect, authorizeRole(["student"]), getUserOrders);
router.delete("/:id", protect, authorizeRole(["student"]), deleteOrder);

export default router;
