import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { ComingSoonToast } from "./ComingSoonToast.jsx";

const GiftCouponCard = () => {
	const [code, setCode] = useState("");

	const handleApply = () => {
		if (!code.trim()) {
			toast.error("Please enter a voucher code");
			return;
		}
		toast.custom(
			<ComingSoonToast
				title='Coupon codes coming soon'
				description='Discount codes will be available in a future update.'
			/>,
			{ id: "coming-soon", duration: 4000 }
		)
	}

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
						value={code}
						onChange={(e) => setCode(e.target.value)}
					/>
				</div>

				<motion.button
					type='button'
					className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleApply}
				>
					Apply Code
				</motion.button>
			</div>
		</motion.div>
	);
};
export default GiftCouponCard;