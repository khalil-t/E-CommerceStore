import express from "express";
import {getAllProducts , getFeaturedProducts , createProduct ,deleteProduct , getRecommendedProducts , getProductsByCategory , toggleFeaturedProduct} from "../controllers/product.controller.js"
import  protectRoute  from "../middleware/protectRoute.js"
import adminOnly from "../middleware/adminOnly.js"
import asyncHandler from "../middleware/asyncHandler.js"

const router = express.Router()

router.get("/", asyncHandler(getAllProducts));

router.get("/featured", asyncHandler(getFeaturedProducts));

router.post("/", protectRoute, adminOnly, asyncHandler(createProduct));

router.delete("/:id", protectRoute, adminOnly, asyncHandler(deleteProduct));

router.get("/recommended", asyncHandler(getRecommendedProducts));

router.get("/category/:category", asyncHandler(getProductsByCategory));

router.patch("/:id/toggle-featured", protectRoute, adminOnly, asyncHandler(toggleFeaturedProduct));

export default router
