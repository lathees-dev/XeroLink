import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    documentName: { type: String, required: true },
    documentUrl: { type: String, required: true },
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
      enum: ["pending", "accepted", "printing", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
