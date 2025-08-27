import Order from "../models/Order.js";
import AppError from "../utils/AppError.js";

export const createOrder = async (req, res, next) => {
  try {
    const {
      userId,
      shopId,
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

    const documentFile = req.file;
    if (!documentFile) {
      return next(new AppError("Document file is required", 400));
    }

    const documentUrl = `/uploads/${documentFile.filename}`;
    const documentName = documentFile.originalname;

    const newOrder = await Order.create({
      userId,
      shopId,
      documentName,
      documentUrl,
      copies,
      colorMode,
      doubleSided,
      paperSize,
      orientation,
      pagesPerSheet,
      pageRange,
      outputType,
      specialInstructions,
    });

    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    next(err);
  }
};


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