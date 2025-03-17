import express from "express";
import {getAllProducts , getFeaturedProducts , createProduct ,deleteProduct , getRecommendedProducts , getProductsByCategory , toggleFeaturedProduct} from "../controllers/product.controller.js"
import  protectRoute  from "../middleware/protectRoute.js"

const router = express.Router()

router.get("/", getAllProducts);

router.get("/featured", getFeaturedProducts);

router.post("/", protectRoute, createProduct);

router.delete("/:id", protectRoute, deleteProduct);

router.get("/recommended", getRecommendedProducts);

router.get("/category/:category", getProductsByCategory);

router.patch("/:id/toggle-featured", protectRoute, toggleFeaturedProduct);

export default router