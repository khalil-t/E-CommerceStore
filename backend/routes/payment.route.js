import express from "express";
import {createCheckoutSession  ,checkoutSuccess, quoteCheckout} from "../controllers/payment.controller.js"
import  protectRoute  from "../middleware/protectRoute.js"
import asyncHandler from "../middleware/asyncHandler.js"
const router =express.Router()

router.post("/quote", protectRoute, asyncHandler(quoteCheckout));

router.post("/create-checkout-session", protectRoute, asyncHandler(createCheckoutSession));

router.post("/checkout-success", protectRoute, asyncHandler(checkoutSuccess));


export default router
