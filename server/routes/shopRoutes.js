import express from "express";
import {
  updateShopProfile,
  updateShopStatus,
  addService,
  editService,
  removeService,
  listShopOrders,
} from "../controllers/shopController.js";
import protect from "../middlewares/protect.js";
import authorizeRole from "../middlewares/authorizeRole.js";

const router = express.Router();

// All routes require shop authentication
router.put("/profile", protect, authorizeRole(["shop"]), updateShopProfile);
router.patch("/status", protect, authorizeRole(["shop"]), updateShopStatus);
router.post("/services", protect, authorizeRole(["shop"]), addService);
router.put("/services/:serviceId", protect, authorizeRole(["shop"]), editService);
router.delete("/services/:serviceId", protect, authorizeRole(["shop"]), removeService);
router.get("/orders", protect, authorizeRole(["shop"]), listShopOrders);

export default router;
