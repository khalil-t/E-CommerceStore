import express from "express";
import {getCartProducts ,addToCart ,removeAllFromCart , updateQuantity} from "../controllers/cart.controller.js"
import protectRoute from "../middleware/protectRoute.js";
const router = express.Router()

router.post("/getCartProducts",protectRoute, getCartProducts)
router.post("/addToCart",protectRoute, addToCart)
router.delete("/removeAllFromCart/:productId",protectRoute, removeAllFromCart)
router.post("/updateQuantity/:id",protectRoute, updateQuantity)

export default router