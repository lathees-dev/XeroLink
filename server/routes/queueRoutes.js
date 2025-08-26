import express from "express";
import protect from "./../middlewares/protect.js";
import authorizeRole from "../middlewares/authorizeRole.js";
import { addOrderToQueue, getShopQueue, updateQueueStatus } from "../controllers/queueController.js";

const router = express.Router();

router.post("/add", protect, authorizeRole(["shop"]), addOrderToQueue);
router.get("/shop/:shopId", protect, authorizeRole(["shop"]), getShopQueue);
router.patch("/:queueId/status", protect, authorizeRole(["shop"]), updateQueueStatus);

export default router;