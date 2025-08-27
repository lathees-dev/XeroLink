import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import AppError from "../utils/AppError.js";
export const createPayment = async (req, res, next) => {
  try {
    const { orderId, userId, amount, method, transactionId } = req.body;
    // Validate order exists
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    const payment = await Payment.create({
      orderId,
      userId,
      amount,
      method,
      transactionId,
      status: "pending",
    });

    res.status(201).json({ success: true, payment });
  } catch (err) {
    next(err);
  }
};

export const getOrderPayments = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const payments = await Payment.find({ orderId });
    res.json(payments);
  } catch (err) {
    next(err);
  }
};

export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const { status } = req.body;
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { status },
      { new: true }
    );
    if (!payment) return next(new AppError("Payment not found", 404));
    res.json({ success: true, payment });
  } catch (err) {
    next(err);
  }
};