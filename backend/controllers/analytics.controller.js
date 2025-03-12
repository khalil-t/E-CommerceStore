import Product from "../model/product.model";
import User from "../model/user.model.js";
import Order from "../model/order.model";
export const getAnalyticsData = async (req, res)=>{
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

















function getDatesInRange(startDate, endDate) {
    let dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
        dates.push(currentDate.toISOString().split("T")[0]); // Format YYYY-MM-DD
        currentDate.setDate(currentDate.getDate() + 1); // Move to next day
    }

    return dates;
}

 