import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AnalyticsTab = () => {
	const [analyticsData, setAnalyticsData] = useState({
		
numUsers: 0,
		numProduts: 0,
		totalSales: 0,
		totalRevenue: 0,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [dailySalesData, setDailySalesData] = useState([]);


		useEffect(() => {

		const fetchAnalyticsData = async () => {
			try {
				 const response = await fetch(import.meta.env.VITE_APP_GETANALYTICSDATA, {
        method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      });
      const data= await response.json()
				setAnalyticsData(data);
			} catch (error) {
				console.error("Error fetching analytics data:", error);
			} finally {
				setIsLoading(false);
			}
		};

				fetchAnalyticsData();

	    const fetchDailySales=async()=>{
				try {
				 const response = await fetch(import.meta.env.VITE_APP_DAILYSALES, {
        method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      });
      const data= await response.json()
	  console.log(data)
				setDailySalesData(
					data.salesData.map((item) => ({
				name: item.date, 
				sales: item.sales,
				revenue: item.revenue,
			}))
				);
			} catch (error) {
				console.error("Error fetching analytics data:", error);
			} finally {
				setIsLoading(false);
			}
		}
fetchDailySales()
	}, []);




	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
				<AnalyticsCard
					title='Total Users'
					icon={Users}
					color='from-emerald-500 to-teal-700'
							value={analyticsData.numUsers}

				/>
				<AnalyticsCard
					title='Total Products'
					icon={Package}
					color='from-emerald-500 to-green-700'
							value={analyticsData.numProduts}

				/>
				<AnalyticsCard
					title='Total Sales'
					icon={ShoppingCart}
					color='from-emerald-500 to-cyan-700'
							value={analyticsData.totalSales}

				/>
				<AnalyticsCard
					title='Total Revenue'
					icon={DollarSign}
							value={`$${analyticsData.totalRevenue.toFixed(2)}`}

					color='from-emerald-500 to-lime-700'
				/>
			</div>
			<motion.div
				className='bg-gray-800/60 rounded-lg p-6 shadow-lg'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.25 }}
			>
				<ResponsiveContainer width='100%' height={400}>
					<LineChart data={dailySalesData}>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='name' stroke='#D1D5DB' />
						<YAxis yAxisId='left' stroke='#D1D5DB' />
						<YAxis yAxisId='right' orientation='right' stroke='#D1D5DB' />
						<Tooltip />
						<Legend />
						<Line
							yAxisId='left'
							type='monotone'
							dataKey='sales'
							stroke='#10B981'
							activeDot={{ r: 8 }}
							name='Sales'
						/>
						<Line
							yAxisId='right'
							type='monotone'
							dataKey='revenue'
							stroke='#3B82F6'
							activeDot={{ r: 8 }}
							name='Revenue'
						/>
					</LineChart>
				</ResponsiveContainer>
			</motion.div>
		</div>
	);
};
export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
	<motion.div
		className={`bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden relative ${color}`}
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	>
		<div className='flex justify-between items-center'>
			<div className='z-10'>
				<p className='text-emerald-300 text-sm mb-1 font-semibold'>{title}</p>
				<h3 className='text-white text-3xl font-bold'>{value}</h3>
			</div>
		</div>
		<div className='absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-900 opacity-30' />
		<div className='absolute -bottom-4 -right-4 text-emerald-800 opacity-50'>
			<Icon className='h-32 w-32' />
		</div>
	</motion.div>
);