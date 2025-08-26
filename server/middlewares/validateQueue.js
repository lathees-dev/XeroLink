import { body, validationResult } from "express-validator";

export const validateQueue = [
  body("shopId").isMongoId().withMessage("Invalid shopId"),
  body("orderId").isMongoId().withMessage("Invalid orderId"),
  body("position")
    .isInt({ min: 1 })
    .withMessage("Position must be a positive integer"),
  body("estimatedTime").isInt({ min: 1 }).optional(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
