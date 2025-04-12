import express from "express"
import { login , logout , signup , getAllUsers } from "../controllers/auth.controller.js"
import protectRoute from "../middleware/protectRoute.js"
const router =express.Router()

router.post("/signup",signup)
router.get("/getAllUsers",protectRoute,getAllUsers)
router.post("/login",login)
router.post("/logout",logout)

  

export default router ;