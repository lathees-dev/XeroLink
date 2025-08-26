import { body, validationResult } from "express-validator";

export const validateOrder = [
  body("userId").isMongoId().withMessage("Invalid userId"),
  body("shopId").isMongoId().withMessage("Invalid shopId"),
  body("documentName")
    .isString()
    .notEmpty()
    .withMessage("Document name required"),
  body("copies").isInt({ min: 1 }).withMessage("Copies must be at least 1"),
  body("colorMode")
    .isIn(["black_white", "color", "grayscale"])
    .withMessage("Invalid color mode"),
  body("doubleSided").isBoolean().withMessage("doubleSided must be boolean"),
  body("paperSize")
    .isIn(["A4", "A3", "Letter", "Legal", "Bond"])
    .withMessage("Invalid paper size"),
  body("orientation")
    .isIn(["portrait", "landscape"])
    .withMessage("Invalid orientation"),
  body("pagesPerSheet").isInt({ min: 1 }).optional(),
  body("pageRange").isString().optional(),
  body("outputType").isIn(["spiral", "calico", "plain", "stapled"]).optional(),
  body("specialInstructions").isString().optional(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
