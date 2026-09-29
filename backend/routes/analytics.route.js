import express from "express";
import { getAnalyticsData, getDailySalesData } from "../controllers/analytics.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import adminOnly from "../middleware/adminOnly.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router()

router.get("/summary", protectRoute, adminOnly, asyncHandler(getAnalyticsData));

router.get("/daily-sales", protectRoute, adminOnly, asyncHandler(getDailySalesData));

export default router
