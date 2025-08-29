import Shop from "../models/Shop.js";
import AppError from "../utils/AppError.js";

// Update shop profile
export const updateShopProfile = async (req, res, next) => {
  try {
    const updates = (({ name, email,phone, location, description }) => ({
      name,
      email,
      phone,
      location,
      description,
    }))(req.body);
    const shop = await Shop.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    });
    if (!shop) return next(new AppError("Shop not found", 404));
    res.json({ success: true, shop });
  } catch (err) {
    next(err);
  }
};

// Update shop status (open/closed)
export const updateShopStatus = async (req, res, next) => {
  try {
    const { isOpen } = req.body;
    if (typeof isOpen !== "boolean") {
      return next(new AppError("Invalid status, must be a boolean", 400));
    }
    const shop = await Shop.findByIdAndUpdate(
      req.user.id,
      { isOpen },
      { new: true }
    );
    if (!shop) return next(new AppError("Shop not found", 404));
    res.json({ success: true, shop });
  } catch (err) {
    next(err);
  }
};

// Add a new service
export const addService = async (req, res, next) => {
  try {
    const { name, price, description } = req.body;
    if (!name || !price)
      return next(new AppError("Name and price required", 400));
    const shop = await Shop.findById(req.user.id);
    if (!shop) return next(new AppError("Shop not found", 404));
    shop.services.push({ name, price, description });
    await shop.save();
    res.json({ success: true, services: shop.services });
  } catch (err) {
    next(err);
  }
};

// Edit a service
export const editService = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const { name, price, description } = req.body;
    const shop = await Shop.findById(req.user.id);
    if (!shop) return next(new AppError("Shop not found", 404));
    const service = shop.services.id(serviceId);
    if (!service) return next(new AppError("Service not found", 404));
    if (name) service.name = name;
    if (price !== undefined) service.price = price;
    if (description !== undefined) service.description = description;
    await shop.save();
    res.json({ success: true, service });
  } catch (err) {
    next(err);
  }
};

// Remove a service
export const removeService = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const shop = await Shop.findById(req.user.id);
    if (!shop) return next(new AppError("Shop not found", 404));
    // Remove by ID using pull
    const prevLength = shop.services.length;
    shop.services.pull(serviceId); // <--- THIS LINE
    if (shop.services.length === prevLength) {
      return next(new AppError("Service not found", 404));
    }
    await shop.save();
    res.json({ success: true, services: shop.services });
  } catch (err) {
    next(err);
  }
};

// List shop orders (for dashboard)
import Order from "../models/Order.js";
export const listShopOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ shopId: req.user.id });
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
};
