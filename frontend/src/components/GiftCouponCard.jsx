import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import useProductStore from "../stores/useProductStore"
import useUser from "../lib/Zustand";
const GiftCouponCard = () => {
	const [userInputCode, setUserInputCode] = useState("");
//get coupon , set code , remove coupon 
	
const {getCoupon,creatCoupon,validateCoupon}=useProductStore()

const { voucherCode, setVoucherCode } = useUser();


useEffect(()=>{
const fetchData=async()=>{
	const data = await getCoupon();
}
fetchData();
},[])

const handleSubmit=async(e,voucherCode)=>{
	console.log(voucherCode)
	if (!voucherCode) {
			alert("Please enter a voucher code");
			return;
		}
		await validateCoupon(voucherCode);
}
console.log(voucherCode)

let coupon
	return (
		<motion.div
			className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
		>
			<div className='space-y-4'>
				<div>
					<label htmlFor='voucher' className='mb-2 block text-sm font-medium text-gray-300'>
						Do you have a voucher or gift card?
					</label>
					<input
						type='text'
						id='voucher'
						className='block w-full rounded-lg border border-gray-600 bg-gray-700 
            p-2.5 text-sm text-white placeholder-gray-400 focus:border-emerald-500 
            focus:ring-emerald-500'
						placeholder='Enter code here'
			 value={voucherCode}
  onChange={(e) => setVoucherCode(e.target.value)}
						required
					/>
				</div>

				<motion.button
					type='button'
					className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={(e)=>handleSubmit(e,voucherCode)}
				>
					Apply Code
				</motion.button>
			</div>
		
			{coupon && (
				<div className='mt-4'>
					<h3 className='text-lg font-medium text-gray-300'>Your Available Coupon:</h3>
					<p className='mt-2 text-sm text-gray-400'>
					</p>
				</div>
			)}
		</motion.div>
	);
};
export default GiftCouponCard;