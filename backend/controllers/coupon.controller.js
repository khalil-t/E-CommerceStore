
import Coupon from "../model/coupon.model.js"
    import Order from "../model/order.model.js"


export const getCoupon =async (req , res)=>{
try{
const userId  = req.user.id
const coupon = await Coupon.findOne({
    userId: userId,
    isActive: true,
})

if(!coupon){
    return res.status(404).json({ message: "No active coupon found" });
}
res.status(200).json(coupon)
}
catch(error){
    console.log("error" , error.message)
    res.status(500).json({ message: "Server error", error: error.message });
    }

}




export const creatCoupon = async(req, res)=>{
try{
console.log(req.user.id)
const {code, discountPercentage,expirationDate  , isActive}= req.body

if(isActive==false || !code){
    return res.status(404).json({ message: "No active coupon " });
}


const userId  = req.user.id
const coupon =await Coupon.create({
     userId: userId,code, discountPercentage,expirationDate  , isActive
})

  res.status(201).json({ message: "Coupon created", coupon });
}
catch(error){
    console.log("error" , error.message)
    res.status(500).json({ message: "Server error", error: error.message });
    }}



export const validateCoupon= async(req,res)=>{
try{
    const userId  = req.user.id
    const order= await Order.find({"user":userId})


    const {code} = req.body
    const currentDate= new Date()
    const coupon = await Coupon.findOne({
        userId: userId,
        code: code,
        isActive: true,
    })

if(!coupon){
   return res.status(404).json({message: "No active coupon found" })
}

coupon.isActive= true
await coupon.save()
console.log(coupon.isActive)


  const lastOrder = order[order.length - 1];

const discount = (coupon.discountPercentage / 100);
const discountedTotal = lastOrder.totalAmount * (1 - discount);

lastOrder.totalAmount = discountedTotal;
await lastOrder.save()
console.log(lastOrder.totalAmount)



res.status(200).json({     message: "Coupon is valid",
    code: coupon.code,
    discountPercentage: coupon.discountPercentage,
totalAmount:lastOrder.totalAmount
} )
}
catch(error){
    console.log("error" , error.message)
    res.status(500).json({ message: "Server error", error: error.message });
    }

}