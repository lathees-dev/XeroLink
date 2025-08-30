import Order from "../models/Order.js";
import AppError from "../utils/AppError.js";

// Create new order
export const createOrder = async (req, res, next) => {
  try {
    const {
      shopId,
      services,
      copies,
      colorMode,
      doubleSided,
      paperSize,
      orientation,
      pagesPerSheet,
      pageRange,
      outputType,
      specialInstructions,
    } = req.body;

    // Handle multiple file uploads (if using multer.array)
    const files = req.files || [];
    if (!files.length) return next(new AppError("At least one document file is required", 400));

    const documentFiles = files.map(file => ({
      url: `/uploads/${file.filename}`,
      name: file.originalname,
    }));

    // Calculate total amount from services
    const amount = services.reduce((sum, s) => sum + (s.price * (s.quantity || 1)), 0);

    const newOrder = await Order.create({
      userId: req.user.id,
      shopId,
      services,
      documentFiles,
      copies,
      colorMode,
      doubleSided,
      paperSize,
      orientation,
      pagesPerSheet,
      pageRange,
      outputType,
      specialInstructions,
      amount,
      paymentStatus: "pending",
      status: "submitted",
    });

    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/user
export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
};


export const getOrderDetails = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return next(new AppError("Order not found", 404));
    }
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// UPDATE /api/orders/:id
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatus = ["queued", "processing", "completed", "cancelled"];
    if (!validStatus.includes(status)) {
      return next(new AppError("Invalid status value", 400));
    }
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );
    if (!order) return next(new AppError("Order not found", 404));
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// Leave Feedback (user only)
export const leaveOrderFeedback = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) return next(new AppError("Order not found", 404));
    if (req.user.role !== "student" || req.user.id !== order.userId.toString()) {
      return next(new AppError("Not authorized to leave feedback", 403));
    }
    order.feedback = { rating, comment };
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
}

//Cancel Order (user or shop)
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return next(new AppError("Order not found", 404));
    // Only user who created or shop can cancel
    if (
      req.user.role === "student" &&
      req.user.id !== order.userId.toString() &&
      req.user.role === "shop" &&
      req.user.id !== order.shopId.toString()
    ) {
      return next(new AppError("Not authorized to cancel this order", 403));
    }
    order.status = "cancelled";
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/orders/:id
export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return next(new AppError("Order not found", 404));
    }
    res.json({ success: true, message: "Order deleted" });
  } catch (err) {
    next(err);
  }
};
