import Product from "../model/product.model.js";
import User from "../model/user.model.js";
import Order from "../model/order.model.js";
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


export const getDailySalesData=async(req, res)=>{
try{
const startDate = new Date("2025-06-01T00:00:00Z");
const endDate = new Date(); 

    const orders = await Order.find({
    createdAt: { $gte: startDate, $lte: endDate}
});

const salesData = await Order.aggregate([
    {
        $match: {
            createdAt: {
                $gte: startDate,
                $lte: endDate,
            },
        },
    },
    {
        $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            sales: { $sum: 1 },
            revenue: { $sum: "$totalAmount" },
        },
    },
    { $sort: { _id: 1 } },
]);


let dates = []
dates = getDatesInRange(startDate, endDate)


const completeSalesData = dates.map(date => {
    const found = salesData.find(sale => sale._id === date);
    return {
        date,
        sales: found ? found.sales : 0,
        revenue: found ? found.revenue : 0
    };
});


res.status(200).json({
    success: true,
    orders: orders,
    salesData : completeSalesData
});


}
catch(error){
    console.log("error" , error.message)
    res.status(500).json({ message: "Server error", error: error.message });
    
    }
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

 