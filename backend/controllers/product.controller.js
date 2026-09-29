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
try {

    const { id: productId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(productId)){
        return res.status(400).json({ message: "Invalid product id" });
    }

	const product = await Product.findById(productId)

if(!product){
    return res.status(404).json({ message: "Product not found" })
}

// Deleting the stored image is best effort: it must never be why the product fails to delete,
// and a storage failure must not leave this request without a response.
let imageDeleted = false;

if (product.image) {
    try {
        // Images are uploaded with folder: "products", so the publicId is "products/filename";
        // using only the filename targets a resource that does not exist.
        const filename = product.image.split("/").pop().split(".")[0];
        const publicId = `products/${filename}`;

        const result = await cloudinary.uploader.destroy(publicId);
        imageDeleted = result?.result === "ok";

        if (!imageDeleted) {
            console.warn(`Cloudinary did not remove ${publicId}:`, result?.result);
        }
    } catch (imageError) {
        console.warn(`Image deletion failed for ${productId}:`, imageError.message);
    }
}

await Product.findByIdAndDelete(productId)

return res.status(200).json({
    message: "Product deleted successfully",
    imageDeleted,
});
  }

catch(error){
    console.log("error" , error.message)
    return res.status(500).json({ message: "Server error", error: error.message });
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

if (!product || product.length===0){
return res.status(404).json({ message: "No products found in this category"})
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
if(product.isFeatured  == true ){
     product.isFeatured  = false
}
else{  product.isFeatured  = true}
await product.save()

res.json(product)
}
catch(error){
    console.log("error" , error.message)
    res.status(500).json({ message: "Server error", error: error.message });
}



}