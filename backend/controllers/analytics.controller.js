import Product from "../model/product.model";
import User from "../model/user.model.js";
import Order from "../model/order.model";
export const getAnalyticsData = async (req, res)=>{
try{
const  numProducts  = await Product.countDocuments()
const  numUsers = await User.countDocuments()

const numSales= await Order.aggregate([
 {   $group: {
        _id: null, 
        totalSales: { $sum: 1 }, 
        totalRevenue: { $sum: "$totalAmount" }, 
      },}
])


const summary = numSales.length > 0 ? numSales[0] : { totalSales: 0, totalRevenue: 0 };


res.status(200).json({
    numUsers : numUsers,
    numProduts: numProducts ,
    totalSales: summary.totalSales,
    totalRevenue: summary.totalRevenue,
  });
 



}

catch(error){
    console.log("error" , error.message)
     res.status(500).json({ message: "Server error", error: error.message });
    }


}