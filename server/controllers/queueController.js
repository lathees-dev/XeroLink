import Queue from "../models/Queue.js"
import Order from "../models/Order.js"

export const addOrderToQueue = async (req, res) => {
    try {
        const { shopId, orderId, position, estimatedTime } = req.body;
        // validate order exists
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ error: "Order not found" });

        const queueItem = await Queue.create({
            shopId,
            orderId,
            position,
            status: "waiting",
            estimatedTime,
        });
        res.status(201).json({ success: true, queueItem });
    } catch (err) {
        res.status(500).json({ error: "Failed to add order to queue" });
    }
};

export const getShopQueue = async (req, res) => {
    try {
        if (req.user.role !== "shop" || req.user.id !== req.params.shopId) {
            return res.status(403).json({error: "Forbidden: Insufficient permissions"})
        }
        const { shopId } = req.params;
        const queue = await Queue.find({ shopId }).populate("orderId");
        res.json(queue);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch queue" });
    }
};

export const updateQueueStatus = async (req, res) => {
    try {
        const { queueId } = req.params;
        const { status } = req.body;
        const queueItem = await Queue.findByIdAndUpdate(queueId, { status }, { new: true });
        if (!queueItem) return res.status(404).json({ error: "Queue item not found" });
        res.status(200).json({ success: true, queueItem });
    } catch (err) {
        res.status(500).json({ error: "Failed to update queue status" });
    }
};