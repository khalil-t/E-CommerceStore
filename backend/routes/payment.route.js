import express from "express";
import {createCheckoutSession  ,checkoutSuccess, quoteCheckout} from "../controllers/payment.controller.js"
import  protectRoute  from "../middleware/protectRoute.js"
import asyncHandler from "../middleware/asyncHandler.js"
const router =express.Router()

// Read-only: prices the cart and returns a total, creating no Order.
router.post("/quote", protectRoute, asyncHandler(quoteCheckout));

router.post("/create-checkout-session", protectRoute, asyncHandler(createCheckoutSession));

// Confirms payment. The order is marked paid only once verifyPayment approves, and the gift
// coupon is granted only here.
router.post("/checkout-success", protectRoute, asyncHandler(checkoutSuccess));


export default router
