import express from "express";
import {createCheckoutSession  ,checkoutSuccess, quoteCheckout} from "../controllers/payment.controller.js"
import  protectRoute  from "../middleware/protectRoute.js"
const router =express.Router()

// Read-only: prices the cart and returns a total. Creates no Order.
router.post("/quote", protectRoute, quoteCheckout);

router.post("/create-checkout-session", protectRoute, createCheckoutSession);

router.post("/checkout-success", protectRoute, checkoutSuccess);


export default router


