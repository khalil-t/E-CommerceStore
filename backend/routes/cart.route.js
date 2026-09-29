import express from "express";
import {getCartProducts ,addToCart ,removeAllFromCart , updateQuantity} from "../controllers/cart.controller.js"
import protectRoute from "../middleware/protectRoute.js";
import asyncHandler from "../middleware/asyncHandler.js";
const router = express.Router()

router.get("/getCartProducts",protectRoute, asyncHandler(getCartProducts))
router.post("/addToCart",protectRoute, asyncHandler(addToCart))
router.delete("/removeAllFromCart/:productId",protectRoute, asyncHandler(removeAllFromCart))
router.delete("/removeAllFromCart",protectRoute, asyncHandler(removeAllFromCart))
router.patch("/updateQuantity/:id",protectRoute, asyncHandler(updateQuantity))

export default router
