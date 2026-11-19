import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import authRoutes from "./routes/authRoutes";
import {
  notFound,
  errorMiddleware,
} from "./middleware/errorMiddleware";
import offerRoutes from "./routes/offerRoutes";
import seasonRoutes from "./routes/seasonRoutes";
import returnRequestRoutes from "./routes/returnRequestRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import path from "path";


dotenv.config();

const app = express();
app.use(express.static(path.join(process.cwd(), "public")));
app.use("/uploads/seasons", express.static(path.join(process.cwd(), "uploads", "seasons")));
app.use(cors());
app.use(express.json());
// app.use(
//   "/uploads",
//   express.static(path.join(process.cwd(), "uploads"))
// );
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/seasons", seasonRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/returns", returnRequestRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to TootieToys Backend API!",
  });
});

app.use(notFound);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
