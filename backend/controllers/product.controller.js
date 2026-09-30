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

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const discardUploadedImage = async (upload) => {
    if (!upload?.public_id) return;
    try {
        await cloudinary.uploader.destroy(upload.public_id);
    } catch (cleanupError) {
        console.warn("Could not remove orphaned upload:", cleanupError.message);
    }
};

export const createProduct = async (req, res) => {
    try {
      const { name, description, price, quantity, image, category } = req.body;
      let cloudinaryResponse = null;

      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ message: "Name is required" });
      }

      if (typeof description !== "string" || !description.trim()) {
        return res.status(400).json({ message: "Description is required" });
      }

      const parsedPrice = Number(price);
      if (price === "" || price === null || price === undefined || !Number.isFinite(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({ message: "Price must be a number of 0 or more" });
      }

      let parsedQuantity = 0;
      if (quantity !== undefined && quantity !== null && quantity !== "") {
        parsedQuantity = typeof quantity === "number" ? quantity : Number(quantity);
        if (!Number.isInteger(parsedQuantity) || parsedQuantity < 0) {
          return res.status(400).json({ message: "Quantity must be a whole number of 0 or more" });
        }
      }

      if (typeof category !== "string" || !category.trim()) {
        return res.status(400).json({ message: "Category is required" });
      }

      if (typeof image !== "string" || !image) {
        return res.status(400).json({ message: "Image is required" });
      }

      if (!/^data:image\/[a-z0-9.+-]+;base64,/i.test(image)) {
        return res.status(400).json({ message: "Image must be a base64 data URL" });
      }

      const encodedBytes = image.length - image.indexOf(",") - 1;
      if (encodedBytes > MAX_IMAGE_BYTES * 1.4) {
        return res.status(413).json({ message: "Image is larger than 5 MB" });
      }

      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp", "avif", "gif"],
      });

      const product = await Product.create({
        name: name.trim(),
        description: description.trim(),
        price: parsedPrice,
        quantity: parsedQuantity,
        image: cloudinaryResponse?.secure_url || "",
        category,
      });

      res.status(201).json(product);
    } catch (error) {
      await discardUploadedImage(cloudinaryResponse);
      if (error.name === "ValidationError") {
        return res.status(400).json({ message: error.message });
      }
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


let imageDeleted = false;

if (product.image) {
    try {
       
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
                quantity: 1,
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