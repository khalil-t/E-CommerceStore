
import mongoose from "mongoose"
import Product from "../model/product.model"
export const getCartProducts =async (req , res)=>{
try{

 const products = await Product.find({ _id: { $in: req.user.cartItems.map(item => item.id) } }) 

 const cartItems = products.map((product)=>{
const item = req.user.cartItems.find((cartItem)=>{
cartItem.product.totoString() === product._id.toString()
return {...product.toJSON(), quantity: item ? item.quantity : 1}

})
res.status(201).send(cartItems)
 })
}
catch(error){
    console.log("Error fetching cart products:", error.message);

    res.status(500).json({error: error.message})
}


}