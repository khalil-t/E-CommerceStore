import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
dotenv.config();


import analyticsRoutes from "./routes/analytics.route.js";
import authRoutes from "./routes/auth.route.js"
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import productRoutes from "./routes/product.route.js";
import cookieParser from "cookie-parser";


const app = express();
app.use(cookieParser());
const PORT = process.env.PORT ;
app.use(express.json());

app.use("/api/analytics", analyticsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/products", productRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB();
});
