import Queue from "../models/Queue.js";
import Order from "../models/Order.js";
import AppError from "../utils/AppError.js";

export const addOrderToQueue = async (req, res, next) => {
  try {
    const { shopId, orderId, position, estimatedTime } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return next(new AppError("Order not found", 404));

    const queueItem = await Queue.create({
      shopId,
      orderId,
      position,
      status: "waiting",
      estimatedTime,
    });
    res.status(201).json({ success: true, queueItem });
  } catch (err) {
    next(err);
  }
};

export const getShopQueue = async (req, res, next) => {
  try {
    if (req.user.role !== "shop" || req.user.id !== req.params.shopId) {
      return next(new AppError("Forbidden: Insufficient permissions", 403));
    }
    const { shopId } = req.params;
    const queue = await Queue.find({ shopId }).populate("orderId");
    res.json({ success: true, queue });
  } catch (err) {
    next(err);
  }
};

export const updateQueueStatus = async (req, res, next) => {
  try {
    const { queueId } = req.params;
    const { status } = req.body;
    const queueItem = await Queue.findByIdAndUpdate(
      queueId,
      { status },
      { new: true }
    );
    if (!queueItem) return next(new AppError("Queue item not found", 404));
    res.status(200).json({ success: true, queueItem });
  } catch (err) {
    next(err);
  }
};
