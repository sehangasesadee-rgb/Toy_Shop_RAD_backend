import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Access denied. No token provided.",
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, jwtSecret);

    req.user = decoded;

    next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("JWT ERROR:", error.message);
    } else {
      console.log("JWT ERROR:", error);
    }

    res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

export default authMiddleware;
