import Student from "../models/User.js";
import Shop from "../models/Shop.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import AppError from "../utils/AppError.js";

const getModelByRole = (role) => {
  if (role === "student") {
    return Student;
  }
  if (role === "shop") {
    return Shop;
  }
  throw new AppError("Invalid role", 400);
};

export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;
    let additionalFields = {};

    if (role === "shop") {
      const { location, services, isOpen } = req.body;
      additionalFields = { location, services, isOpen };
    }

    const Model = getModelByRole(role);
    const userExists = await Model.findOne({ email });
    if (userExists) {
      return next(new AppError("User already exists", 400));
    }

    const hashedPw = await bcrypt.hash(password, 10);
    const user = await Model.create({
      name,
      email,
      password: hashedPw,
      phone,
      role,
      ...additionalFields,
    });

    const token = generateToken(user._id, user.role);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const Model = getModelByRole(role);
    const user = await Model.findOne({ email });
    if (!user) {
      return next(new AppError("User not found", 400));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new AppError("Invalid Credentials", 401));
    }

    const token = generateToken(user._id, user.role);
    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};
