import express from "express";
import {getCartProducts ,addToCart ,removeAllFromCart , updateQuantity} from "../controllers/cart.controller.js"
const router = express.Router()

router.post("/getCartProducts", getCartProducts)
router.post("/addToCart", addToCart)
router.post("/removeAllFromCart", removeAllFromCart)
router.post("/updateQuantity", updateQuantity)

export default router