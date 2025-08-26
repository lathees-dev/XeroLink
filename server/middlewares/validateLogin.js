import { body, validationResult } from "express-validator";

export const validateLogin = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").isString().notEmpty().withMessage("Password required"),
  body("role")
    .isIn(["student", "shop"])
    .withMessage("Role must be student or shop"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
