import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import axios from "../lib/axios";
import UseCartStore from "../stores/useCartStore.jsx"
import useProductStore from "../stores/useProductStore.jsx"
import { useEffect } from "react";
import React, {  useState } from "react";
import toast from "react-hot-toast";
import useUser from "../lib/Zustand.jsx";
const OrderSummary = () => {
	const productList = useUser((state) => state.productList);
		const cartItems = useUser((state) => state.cartItems);

const{getCheckoutQuote, createCheckoutSession} = UseCartStore()

const [total , setTotal] =useState(0)
const [loading , setLoading] =useState(false)
const [checkingOut , setCheckingOut] =useState(false)

const cartKey = JSON.stringify(cartItems.map((item) => [item._id, item.quantity]))

// Read-only. Asks the backend for the authoritative total. This endpoint creates
// no Order, so rendering the cart stays side-effect free.
useEffect(()=>{
	if(!cartItems.length){
		setTotal(0)
		return
	}

	let cancelled = false;

	const fetchQuote=async()=>{
		setLoading(true)
		try{
			const data = await getCheckoutQuote(cartItems);
			if(!cancelled) setTotal(data.finalPrice)
		}catch{
			if(!cancelled) setTotal(0)
		}finally{
			if(!cancelled) setLoading(false)
		}
	}
	fetchQuote();

	return ()=>{cancelled = true}
},[cartKey])

// The only place checkout state is created, and only on an explicit click.
const handleCheckout=async()=>{
	if(checkingOut || !cartItems.length) return

	setCheckingOut(true)
	try{
		const data = await createCheckoutSession(cartItems)
		// No payment provider is wired up yet. When Stripe is connected this is
		// where the redirect to the hosted checkout page belongs.
		toast.success(data.message)
	}catch(error){
		toast.error(error.message)
	}finally{
		setCheckingOut(false)
	}
}

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

						<dl className='flex items-center justify-between gap-4 border-t border-gray-600 pt-2'>
							<dt className='text-base font-bold text-white'>Total</dt>
							<dd className='text-base font-bold text-emerald-400'>
								{loading ? "Loading..." : `$${total.toFixed(2)}`}
							</dd>
						</dl>
					</div>

					<button
						onClick={handleCheckout}
						disabled={checkingOut || loading || !cartItems.length}
						className='w-full flex justify-center py-2 px-4 border border-transparent
						rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600
						hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
					  focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50'
					>
						{checkingOut ? "Starting checkout..." : "Proceed to Checkout"}
					</button>


	

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