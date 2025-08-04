import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
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

  const documentFile = req.file; // handled by multer

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
};


export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        await Order.deleteOne({ _id: id, userId: req.user.id });
        res.json({ message: "Order deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete order" });
    }
}