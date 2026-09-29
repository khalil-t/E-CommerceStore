import express from "express"
import { login , logout , signup , getAllUsers , getUserProfile , refresh } from "../controllers/auth.controller.js"
import protectRoute from "../middleware/protectRoute.js"
import adminOnly from "../middleware/adminOnly.js"
import asyncHandler from "../middleware/asyncHandler.js"
import { loginLimiter, signupLimiter, refreshLimiter } from "../middleware/rateLimit.js"
const router =express.Router()

router.post("/signup", signupLimiter, asyncHandler(signup))
router.get("/me",protectRoute,asyncHandler(getUserProfile))
router.get("/getAllUsers",protectRoute,adminOnly,asyncHandler(getAllUsers))
router.post("/login",loginLimiter, asyncHandler(login))
router.post("/logout",asyncHandler(logout))
router.post("/refresh", refreshLimiter, asyncHandler(refresh))

export default router ;
