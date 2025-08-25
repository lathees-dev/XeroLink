import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: ["UPI", "Card", "NetBanking", "Cash"],
      default: "UPI",
    },
    transactionId: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "refunded"],
      default: "pending",
    },
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
