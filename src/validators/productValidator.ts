import { Request, Response, NextFunction } from "express";

const validateProduct = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const {
    name,
    description,
    price,
    category,
    image,
    stock,
    ageRange,
  } = req.body;

  if (
    !name ||
    !description ||
    price === undefined ||
    !category ||
    !image ||
    !ageRange
  ) {
    res.status(400).json({
      success: false,
      message: "Please provide all required product fields",
    });
    return;
  }

  if (typeof price !== "number" || price < 0) {
    res.status(400).json({
      success: false,
      message: "Price must be a non-negative number",
    });
    return;
  }

  if (
    stock !== undefined &&
    (typeof stock !== "number" || stock < 0)
  ) {
    res.status(400).json({
      success: false,
      message: "Stock must be a non-negative number",
    });
    return;
  }

  const validAgeRanges = ["0-2", "3-5", "6-8", "9-12", "13+"];

  if (!validAgeRanges.includes(ageRange)) {
    res.status(400).json({
      success: false,
      message: "Please provide a valid age range",
    });
    return;
  }

  next();
};

export default validateProduct;
