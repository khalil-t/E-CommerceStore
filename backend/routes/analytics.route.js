import express from "express";
import { getAnalyticsData, getDailySalesData } from "../controllers/analytics.controller.js";

const router = express.Router()

router.get("/summary", getAnalyticsData);

router.post("/daily-sales", getDailySalesData);

export default router