import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import toast from "react-hot-toast";
import useUser from "../lib/Zustand.jsx";
import { formatCurrency, getCartItemCount, getCartSubtotal } from "../lib/cartTotals.js";
import { ComingSoonToast } from "./ComingSoonToast.jsx";

const OrderSummary = () => {
	const cartItems = useUser((state) => state.cartItems);

	const itemCount = getCartItemCount(cartItems)
	const subtotal = getCartSubtotal(cartItems)

	const handleCheckout = () => {
		if (!itemCount) return
		toast.custom(
			<ComingSoonToast
				title='Checkout coming soon'
				description='Online payment is not available yet.'
			/>,
			{ id: "coming-soon", duration: 4000 }
		)
	}

	return (
		<motion.div
			className='space-y-6 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className='space-y-1'>
				<h2 className='text-xl font-semibold text-emerald-400'>Order Summary</h2>
				<p className='text-sm text-gray-400'>
					Items: <span className='font-medium text-white'>{itemCount}</span>
				</p>
			</div>

			<dl className='space-y-3'>
				<div className='flex items-center justify-between gap-4'>
					<dt className='text-base font-medium text-gray-300'>Subtotal</dt>
					<dd className='text-base font-medium text-white'>{formatCurrency(subtotal)}</dd>
				</div>

				<div className='flex items-center justify-between gap-4 border-t border-gray-600 pt-3'>
					<dt className='text-base font-bold text-white'>Total</dt>
					<dd className='text-base font-bold text-emerald-400' data-testid='order-total'>
						{formatCurrency(subtotal)}
					</dd>
				</div>
			</dl>

			<motion.button
				type='button'
				onClick={handleCheckout}
				disabled={!itemCount}
				whileHover={{ scale: itemCount ? 1.02 : 1 }}
				whileTap={{ scale: itemCount ? 0.98 : 1 }}
				className='w-full flex justify-center py-2 px-4 border border-transparent
					rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600
					hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
					focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50'
			>
				Proceed to Checkout
			</motion.button>

			<div className='flex items-center justify-center gap-2'>
				<span className='text-sm font-normal text-gray-400'>or</span>
				<Link
					to='/'
					className='inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline'
				>
					Continue Shopping
					<MoveRight size={16} />
				</Link>
			</div>
		</motion.div>
	);
};
export default OrderSummary;