import Payment from "../models/Payment.js";
import Order from "../models/Order.js";

export const createPayment = async (req, res) => {
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
    res.status(500).json({ error: "Failed to create payment" });
  }
};

export const getOrderPayments = async (req, res) => {
  try {
    const { orderId } = req.params;
    const payments = await Payment.find({ orderId });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status } = req.body;
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { status },
      { new: true }
    );
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: "Failed to update payment status" });
  }
};
