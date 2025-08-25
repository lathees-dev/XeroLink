import mongoose from "mongoose";

const queueSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["waiting", "processing", "completed", "cancelled"],
      default: "waiting",
    },
    estimatedTime: {
      type: Number, // in minutes
    },
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Queue", queueSchema);
