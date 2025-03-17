import Product from "../model/product.model.js";
import Coupon from "../model/coupon.model.js";
import Order from "../model/order.model.js";
export const createCheckoutSession= async(req, res)=>{
try{
    const {products, couponCode}=req.body

    if(!Array.isArray(products) || products.length===0){
        return res.status(400).json({ error: "Invalid or empty products array" });
    }
let totalAmount = 0 ;
 products.forEach((product)=>{
    totalAmount+=product.price * product.quantity;
})
let coupon = null
if(couponCode){
     coupon = await Coupon.findOne({
    code: couponCode, 
    userId: req.user._id,  
    isActive: true,     
    expirationDate: { $gt: new Date() } 
})}


if(coupon){
totalAmount-=(totalAmount * coupon.discountPercentage) / 100
}

const newOrder= new Order({
    user: req.user._id,  
    products: products, 
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
    const { orderId, paymentStatus } = req.body; 
try{
const order = await Order.findOne({
    _id: orderId, 
    status : "pending"
})
if (!order) {
    return res.status(404).json({ error: "Pending order not found" });
  }
  if (paymentStatus !== "success") {
    return res.status(400).json({ error: "Payment was not successful" });
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

/*
async function createCoupon(discountPercentage, userId) {
    
    const couponCode = "DISCOUNT" + Math.random().toString(36).substring(2, 8).toUpperCase();

    const newCoupon = new Coupon({
        code: couponCode,
        discountPercentage: discountPercentage,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Valid for 30 days
        userId: userId,
        isActive: true,
    });

    await newCoupon.save()
    return couponCode


}*/
