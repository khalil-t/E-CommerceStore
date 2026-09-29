import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { connectDB } from "./lib/db.js";
dotenv.config({ path: fileURLToPath(new URL("./.env", import.meta.url)) });


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


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((err, req, res, next) => {
    if (!err) return next();

    if (err.type === "entity.parse.failed" || err instanceof SyntaxError) {
        return res.status(400).json({ error: "Malformed JSON body" });
    }

    if (err.type === "entity.too.large") {
        return res.status(413).json({ error: "Request body too large" });
    }

    console.error("Unhandled request error:", err.message);
    res.status(err.status || 500).json({ error: "Server error" });
});

app.use("/api/analytics", analyticsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/products", productRoutes);

app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});


app.use((err, req, res, next) => {
    console.error(err);

    const isProduction = process.env.NODE_ENV === "production";

    res.status(err.status || 500).json({
        error: isProduction ? "Server error" : err.message,
    });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});



