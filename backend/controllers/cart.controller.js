
import mongoose from "mongoose"
import Product from "../model/product.model"

export const getCartProducts =async (req , res)=>{
try{
const products = await Product.find({ _id: { $in: req.user.cartItems.map(item => item.id) } }) 
const cartItems = products.map((product)=>{
const item = req.user.cartItems.find((cartItem)=>{
cartItem.product.totoString() === product._id.toString()
return {...product.toJSON(), quantity: item ? item.quantity : 1}})
res.status(201).send(cartItems)})}
catch(error){
    console.log("Error fetching cart products:", error.message);

    res.status(500).json({error: error.message})}}


export const addToCart= async (req, res)=>{
try{
 const { productId } = req.body;
 const user = req.user 
const product =  user.cartItems.find((item) => item.product.toString() === productId)
if (product){
    product.quantity += 1
}else{
 user.cartItems.push({ product: productId, quantity: 1 })
}
await user.save()
res.status(201).json(user.cartItems)
}
catch(error){
console.log("error" , error.message)
res.status(500).json({ message: "Server error", error: error.message });

}

}




export const removeAllFromCart= async (req,res)=>{
try{
const {productId}= req.params
const user = req.user
if(productId){
    user.cartItems =  user.cartItems.filter((item) => item.product.toString() !== productId)

}
else{
    user.cartItems=[]
}
await user.save()
res.status(201).json(user.cartItems)
}
catch(error){
    console.log("Error in removeAllFromCart controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
}


}



export const updateQuantity = async (req , res)=>{
try{
    const { id: productId } = req.params;
const { quantity } =req.body
const user = req.user

const product = user.cartItems.find(
    (item) => item.product.toString() === productId
);

if(product){

    if (quantity === 0) {
        user.cartItems = user.cartItems.filter(
            (item) => item.product.toString() !== productId
        );
    } else {
        product.quantity = quantity;
    }

    await user.save()
    res.status(201).json(user.cartItems);


}
else{

    res.status(404).json({ message: "Product not found in the cart" });
 
}





await user.save()
res.status(201).json(user.cartItems)}




catch(error){
    console.log("Error in updateQuantity controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
}

}