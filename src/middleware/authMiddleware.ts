import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: JwtPayload & {
    userId: string;
    role: string;
  };
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

    if (typeof decoded === "string" || !decoded.userId || !decoded.role) {
      res.status(401).json({
        message: "Invalid token payload.",
      });
      return;
    }

    req.user = decoded as JwtPayload & {
      userId: string;
      role: string;
    };

    next();
  } catch (error: unknown) {
    console.log(
      "JWT ERROR:",
      error instanceof Error ? error.message : error
    );

    res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

export default authMiddleware;
