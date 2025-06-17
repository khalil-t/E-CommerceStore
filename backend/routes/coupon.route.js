import express from "express";
import { getCoupon, creatCoupon ,validateCoupon} from "../controllers/coupon.controller.js";
import  protectRoute  from "../middleware/protectRoute.js"



const router = express.Router()

router.get("/", protectRoute, getCoupon);

router.post("/validate", protectRoute, validateCoupon);

router.post("/creatCoupon", protectRoute, creatCoupon);

export default router; 