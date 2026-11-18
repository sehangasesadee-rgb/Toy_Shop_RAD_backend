const express = require("express");
const cors = require("cors");
require("dotenv").config();
// console.log("JWT SECRET LOADED:", Boolean(process.env.JWT_SECRET));

const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const { notFound, errorMiddleware } = require("./middleware/errorMiddleware");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
  res.json({
    message: "Welcome to TootieToys Backend API!",
  });
});
app.use(notFound);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
