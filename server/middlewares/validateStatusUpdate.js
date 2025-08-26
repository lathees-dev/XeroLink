import { body, validationResult } from "express-validator";

export const validateStatusUpdate = (allowedStatuses) => [
  body("status")
    .isIn(allowedStatuses)
    .withMessage(`Status must be one of: ${allowedStatuses.join(", ")}`),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
