import express from "express";
import { getCoupon, creatCoupon ,validateCoupon} from "../controllers/coupon.controller.js";
import  protectRoute  from "../middleware/protectRoute.js"
import adminOnly from "../middleware/adminOnly.js"
import asyncHandler from "../middleware/asyncHandler.js"



const router = express.Router()

router.get("/", protectRoute, asyncHandler(getCoupon));

router.post("/validate", protectRoute, asyncHandler(validateCoupon));

router.post("/creatCoupon", protectRoute, adminOnly, asyncHandler(creatCoupon));

export default router; 
