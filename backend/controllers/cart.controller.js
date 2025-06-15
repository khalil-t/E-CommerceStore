
import mongoose from "mongoose"
import Product from "../model/product.model.js"
import Order from "../model/order.model.js";

export const getCartProducts = async (req, res) => {
    try {
      const validCartItems = req.user.cartItems.filter(item => item.product);
      const productIds = validCartItems.map(item => item.product);
  
      const products = await Product.find({ _id: { $in: productIds } });
 
      const cartItems = validCartItems.map(cartItem => {
        const product = products.find(
          (p) => p._id.toString() === cartItem.product.toString()
        );
        return {
          ...product?.toJSON(),
          quantity: cartItem.quantity,
          _id: cartItem._id 
        };
      });
      res.status(200).json(cartItems);
    } catch (error) {
      console.error("Error fetching cart products:", error.message);
      res.status(500).json({ error: error.message });
    }
  };
  




export const addToCart= async (req, res)=>{
try{
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: User not found" });
      }

const { _id } = req.body;
const user = req.user 
const product = user.cartItems.find((item) => item.product.toString() === _id.toString());


if (product){
    product.quantity += 1
}else{
 user.cartItems.push({ product: _id, quantity: 1 })
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
    const { productId } = req.params;
    const user = req.user;

    if (productId) {
      const cartItemId = new mongoose.Types.ObjectId(productId);

      user.cartItems = user.cartItems.filter(
        (item) => item._id.toString() !== cartItemId.toString()
      );
    } else {
      user.cartItems = [];
    }

    await user.save();
    res.status(201).json(user.cartItems);
}
catch(error){
    console.log("Error in removeAllFromCart controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
}
}



export const updateQuantity = async (req , res)=>{
    try {
        const { id: cartItemId } = req.params;
        const { quantity } = req.body;
        const user = req.user;


     if (!cartItemId || quantity === undefined) {
      return res.status(400).json({ message: "Missing cartItemId or quantity" });
    }

    const itemIndex = user.cartItems.findIndex(
      (item) => item._id.toString() === cartItemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (quantity === 0) {
      user.cartItems.splice(itemIndex, 1);
    } else {
      user.cartItems[itemIndex].quantity = quantity;
    }

    await user.save();
    return res.status(200).json(user.cartItems);
    
      } 

catch(error){
    console.log("Error in updateQuantity controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
}

}
