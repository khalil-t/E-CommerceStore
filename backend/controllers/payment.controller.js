import Product from "../model/product.model";
import Coupon from "../model/coupon.model";
import Order from "../model/order.model";
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


