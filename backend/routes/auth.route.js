import express from "express"
import { login , logout , signup , getAllUsers , getUserProfile , refresh } from "../controllers/auth.controller.js"
import protectRoute from "../middleware/protectRoute.js"
import adminOnly from "../middleware/adminOnly.js"
import { loginLimiter, signupLimiter, refreshLimiter } from "../middleware/rateLimit.js"
const router =express.Router()

// Rate limited because these are the two endpoints worth brute forcing.
router.post("/signup", signupLimiter, signup)
router.get("/me",protectRoute,getUserProfile)
router.get("/getAllUsers",protectRoute,adminOnly,getAllUsers)
router.post("/login",loginLimiter, login)
router.post("/logout",logout)
router.post("/refresh", refreshLimiter, refresh)

export default router ;
