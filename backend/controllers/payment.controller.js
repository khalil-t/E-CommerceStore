import mongoose from "mongoose";
import Product from "../model/product.model.js";
import Coupon from "../model/coupon.model.js";
import Order from "../model/order.model.js";
import { verifyPayment } from "../lib/payments.js";
export const createCheckoutSession= async(req, res)=>{
try{
    const {products, couponCode}=req.body

    if(!Array.isArray(products) || products.length===0){
        return res.status(400).json({ error: "Invalid or empty products array" });
    }

    const productIds = products.map((item) => item.product);

    if(productIds.some((id) => !mongoose.Types.ObjectId.isValid(id))){
        return res.status(400).json({ error: "Invalid product id" });
    }

    const uniqueProductIds = [...new Set(productIds.map((id) => id.toString()))];

    const dbProducts = await Product.find({ _id: { $in: uniqueProductIds } });

    if(dbProducts.length !== uniqueProductIds.length){
        return res.status(404).json({ error: "One or more products were not found" });
    }

    let totalAmount = 0 ;
    const orderProducts = [];

    for (const item of products) {
        const quantity = Number(item.quantity);

        if(!Number.isInteger(quantity) || quantity < 1){
            return res.status(400).json({ error: "Invalid quantity" });
        }

        const dbProduct = dbProducts.find(
            (p) => p._id.toString() === item.product.toString()
        );

        totalAmount += dbProduct.price * quantity;

        orderProducts.push({
            product: dbProduct._id,
            quantity: quantity,
            price: dbProduct.price,
        })
    }


const newOrder= new Order({
    user: req.user._id,  
    products: orderProducts, 
    totalAmount: totalAmount,  
    status: "pending",
})
await newOrder.save(); 


if(totalAmount>= 200){
    await createNewCoupon(req.user._id);
}

res.status(200).json({
    success: true,
    message: "Order created successfully.",
    orderId: newOrder._id,
    finalPrice: totalAmount,
});

}


catch(error){
    console.log("error" , error.message)
     res.status(500).json({ message: "Server error", error: error.message });
    }
}








async function createNewCoupon(userId) {
    await Coupon.findOneAndDelete({userId})
const newCoupon= new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(), // Random code
    discountPercentage: 10, // 10% discount
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days
    userId: userId,
})
await newCoupon.save()
return newCoupon

}

export const checkoutSuccess= async(req, res)=>{
    const { orderId, paymentReference } = req.body;
try{
if(!mongoose.Types.ObjectId.isValid(orderId)){
    return res.status(400).json({ error: "Invalid order id" });
}

const order = await Order.findOne({
    _id: orderId, 
    user: req.user._id,
    status : "pending"
})
if (!order) {
    return res.status(404).json({ error: "Pending order not found" });
  }

  let payment;
  try {
    payment = await verifyPayment({ order, paymentReference });
  } catch (error) {
    return res.status(402).json({ error: error.message });
  }


  const coupon = await Coupon.findOne({
    userId: order.user,
    isActive: true,
  })
if(coupon){
    coupon.isActive=false
await coupon.save()
}
order.status= "paid"
order.paymentReference = payment.reference
await order.save()


res.status(200).json({
    success: true,
    message: "Order completed successfully.",
    orderId: order._id,
    finalPrice: order.totalAmount,
  });
}
catch(error){
    console.log("error" , error.message)
     res.status(500).json({ message: "Server error", error: error.message });
    }

}

