
const { body, validationResult } = require("express-validator");

const validateProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required"),

  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Product category is required"),

  body("image")
    .trim()
    .notEmpty()
    .withMessage("Product image is required"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative number"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    next();
  },
];

module.exports = validateProduct;
