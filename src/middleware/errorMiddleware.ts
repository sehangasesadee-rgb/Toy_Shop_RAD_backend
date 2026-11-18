import { Request, Response, NextFunction } from "express";

const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);

  res.status(404);
  next(error);
};

const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export { notFound, errorMiddleware };
