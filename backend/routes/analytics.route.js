import express from "express";
import { getAnalyticsData, getDailySalesData } from "../controllers/analytics.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import adminOnly from "../middleware/adminOnly.js";

const router = express.Router()

router.get("/summary", protectRoute, adminOnly, getAnalyticsData);

router.get("/daily-sales", protectRoute, adminOnly, getDailySalesData);

export default router
