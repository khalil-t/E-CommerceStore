import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import axios from "../lib/axios";
import UseCartStore from "../stores/useCartStore.jsx"
import { useEffect } from "react";
import React, {  useState } from "react";
import useUser from "../lib/Zustand.jsx";
const OrderSummary = () => {
	const productList = useUser((state) => state.productList);
		const cartItems = useUser((state) => state.cartItems);


let savings 
	let coupon
let formattedTotal 

const [CheckoutSession , setCheckoutSession]=useState()


const{createCheckoutSession} = UseCartStore()


useEffect(()=>{
const fetchData=async()=>{
	const data = await createCheckoutSession(cartItems);
	setCheckoutSession(data);
}
fetchData();
},[cartItems])
	return (
		<motion.div
			className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<p className='text-xl font-semibold text-emerald-400'>Order summary</p>

			<div className='space-y-4'>
				<div className='space-y-2'>
					<dl className='flex items-center justify-between gap-4'>
						<dd className='text-base font-medium text-white'></dd>
					</dl>

					{savings > 0 && (
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-gray-300'>Savings</dt>
							<dd className='text-base font-medium text-emerald-400'>-${formattedSavings}</dd>
						</dl>
					)}

					{CheckoutSession  && (
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-gray-300'></dt>
							<dd className='text-base font-medium text-emerald-400'></dd>
						</dl>
					)}
					<dl className='flex items-center justify-between gap-4 border-t border-gray-600 pt-2'>
						<dt className='text-base font-bold text-white'>Total</dt>



<dd className='text-base font-bold text-emerald-400'>
  {CheckoutSession?.finalPrice ? `$${CheckoutSession.finalPrice.toFixed(2)}` : "ee"}
</dd>
			
				
				
					</dl>
				</div>

	

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
			</div>
		</motion.div>
	);
};
export default OrderSummary;