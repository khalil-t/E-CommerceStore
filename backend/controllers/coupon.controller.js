
import Coupon from "../model/coupon.model.js"

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



export const validateCoupon= async(req,res)=>{

try{
    const userId  = req.user.id
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
if(currentDate >coupon.expirationDate){
coupon.isActive= false
await coupon.save()
return res.status(400).json({message: "Coupon expired"})
}
res.status(200).json({     message: "Coupon is valid",
    code: coupon.code,
    discount: coupon.discount,} )

}
catch(error){
    console.log("error" , error.message)
    res.status(500).json({ message: "Server error", error: error.message });
    }

}