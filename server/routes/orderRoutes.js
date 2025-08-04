import express from "express";
import upload from "../config/multer.js";
import {
  createOrder,
  getUserOrders,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/create", upload.single("document"), createOrder);
router.get("/", getUserOrders);
router.delete("/:id", deleteOrder);

export default router;
