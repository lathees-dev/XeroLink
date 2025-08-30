import mongoose from "mongoose";

const serviceItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    services: { type: [serviceItemSchema], required: true },
    documentFiles: [
      {
        url: { type: String, required: true },
        name: { type: String, required: true },
      },
    ],
    copies: { type: Number, default: 1 },
    colorMode: {
      type: String,
      enum: ["black_white", "color", "grayscale"],
      default: "black_white",
    },
    doubleSided: { type: Boolean, default: false },
    paperSize: {
      type: String,
      enum: ["A4", "A3", "Letter", "Legal", "Bond"],
      default: "A4",
    },
    orientation: {
      type: String,
      enum: ["portrait", "landscape"],
      default: "portrait",
    },
    pagesPerSheet: { type: Number, enum: [1, 2, 4, 6], default: 1 },
    pageRange: { type: String, default: "all" },
    outputType: {
      type: String,
      enum: ["spiral", "calico", "plain", "stapled"],
      default: "plain",
    },
    specialInstructions: { type: String },
    status: {
      type: String,
      enum: ["submitted", "queued", "processing", "completed", "cancelled"],
      default: "submitted",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    transactionId: { type: String },
    amount: { type: Number },
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
