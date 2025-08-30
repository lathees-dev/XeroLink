import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import AppError from "../utils/AppError.js";


export const getOrderPayments = async (req, res, next) => {
try {
  const { orderId } = req.params;
    const payments = await Payment.find({ orderId });
    res.json(payments);
  } catch (err) {
    next(err);
  }
};

// Initiate payment (create a Payment record and payment gateway session)
export const createPayment = async (req, res, next) => {
  try {
    const { orderId, userId, amount, method, transactionId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Optionally, check if order already paid
    if (order.paymentStatus === "paid") {
      return next(new AppError("Order already paid", 400));
    }

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


// Update payment status and order paymentStatus
export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const { status, transactionId } = req.body;

    // Update Payment document
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { status, transactionId },
      { new: true }
    );
    if (!payment) return next(new AppError("Payment not found", 404));

    // Update related Order document
    await Order.findByIdAndUpdate(payment.orderId, {
      paymentStatus: status,
      transactionId: transactionId || payment.transactionId
    });

    res.json({ success: true, payment });
  } catch (err) {
    next(err);
  }
};