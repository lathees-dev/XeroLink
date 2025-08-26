import { body, validationResult } from "express-validator";

export const validateRegistration = [
  body("name").isString().notEmpty().withMessage("Name required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("phone").isString().notEmpty().withMessage("Phone required"),
  body("password").isStrongPassword().withMessage("Password must be strong"),
  body("role")
    .isIn(["student", "shop"])
    .withMessage("Role must be student or shop"),
  // Additional fields for shop registration
  body("location")
    .if(body("role").equals("shop"))
    .isString()
    .notEmpty()
    .withMessage("Shop location required"),
  body("services")
    .if(body("role").equals("shop"))
    .isArray({ min: 1 })
    .withMessage("Shop services required"),
  body("isOpen")
    .if(body("role").equals("shop"))
    .isBoolean()
    .withMessage("isOpen must be boolean"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
