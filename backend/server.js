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
import cors from "cors";



const app = express();

app.use(cookieParser());
const PORT = process.env.PORT ;

const corsOptions = {
  origin: process.env.CORSOPTIONS,
  methods: 'GET,POST,PUT,DELETE,PATCH',
  credentials: true,
};

app.use(cors(corsOptions));


app.use(express.json({ limit: '10mb' })); // or higher if needed
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
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



