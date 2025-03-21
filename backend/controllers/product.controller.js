import mongoose from "mongoose";
import Product from "../model/product.model.js";
import cloudinary  from '../lib/cloudinary.js';
export const getAllProducts=async(req, res)=>{
try{
const products =await Product.find({})
res.json({products})

}
catch(error){
console.log("error" , error.message)
res.status(500).json({ message: "Server error", error: error.message });
}

}

export const getFeaturedProducts = async (req, res)=>{

try{
const product = await Product.find({isFeatured: true})
if(product.length > 0){
res.status(200).json(product)
}
else{
    res.status(404).json({ message: "No featured products found" });
}

}
catch(error){
    console.log("error" , error.message)
    res.status(500).json({ message: "Server error", error: error.message });
}




}

export const createProduct = async (req, res) => {
    try {
      const { name, description, price, image, category } = req.body;
      let cloudinaryResponse = null;
      console.log("Received image:", image);

      if (image) {
        cloudinaryResponse = await cloudinary.uploader.upload(image, {
          folder: "products",
        });
      }

      const product = await Product.create({
        name,
        description,
        price,
        image: cloudinaryResponse?.secure_url || "", 
        category,
      });
  
      res.status(201).json(product);
    } catch (error) {
      console.log("error", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

export const deleteProduct =async (req , res)=>{
try{

    const { id: productId } = req.params;
const product = await Product.findById(productId)

if(!product){
    return res.status(404).json({ message: "Product not found" })
}
if (product.image) {
    const publicId = product.image.split("/").pop().split(".")[0]; // Extract publicId

    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Image Deleted Successfully:", result);
await Product.findByIdAndDelete(productId)
res.status(200).json({ message: "Product deleted successfully" });
  }

}
catch(error){
    console.log("error" , error.message)
    res.status(500).json({ message: "Server error", error: error.message });
}


}

export const getRecommendedProducts=async(req,res)=>{
try{

	const products = await Product.aggregate([
        {
            $sample: { size: 4 },
        },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                image: 1,
                price: 1,
            },
        },
    ]);
res.json(products)
}
catch(error){
    console.log("error" , error.message)
    res.status(500).json({ message: "Server error", error: error.message });
}


}

export const getProductsByCategory = async(req, res)=>{
try{
const {category}=req.params

const product= await Product.find({category: category })

if (product.length===0){
res.status(404).json({ message: "No products found in this category"})
}

res.status(200).json(product)

}
catch(error){
    console.log("error" , error.message)
    res.status(500).json({ message: "Server error", error: error.message });
}





}


export const toggleFeaturedProduct = async (req, res)=>{

try{
    const { id: productId } = req.params;
const product = await Product.findById(productId )
if(product.featured == true ){
     product.featured = false
}
else{  product.featured = true}
await product.save()

res.json(product)
}
catch(error){
    console.log("error" , error.message)
    res.status(500).json({ message: "Server error", error: error.message });
}



}