import express from "express"
import { login , logout , signup , getAllUsers , getUserProfile } from "../controllers/auth.controller.js"
import protectRoute from "../middleware/protectRoute.js"
import adminOnly from "../middleware/adminOnly.js"
const router =express.Router()

router.post("/signup",signup)
router.get("/me",protectRoute,getUserProfile)
router.get("/getAllUsers",protectRoute,adminOnly,getAllUsers)
router.post("/login",login)
router.post("/logout",logout)

  

export default router ;