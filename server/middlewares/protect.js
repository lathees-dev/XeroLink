import jwt from "jsonwebtoken";
import Student from "../models/User.js";
import Shop from "../models/Shop.js";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Use role from token if available
      let user;
      if (decoded.role === "student") {
        user = await Student.findById(decoded.id).select("-password");
      } else if (decoded.role === "shop") {
        user = await Shop.findById(decoded.id).select("-password");
      }

      if (!user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }
      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export default protect;
