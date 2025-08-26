import express from "express";
import { addOrderToQueue, getShopQueue, updateQueueStatus } from "../controllers/queueController.js";

const router = express.Router();

router.post("/add", addOrderToQueue);
router.get("/shop/:shopId", getShopQueue);
router.patch("/:queueId/status", updateQueueStatus);

export default router;