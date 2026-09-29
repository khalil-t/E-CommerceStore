import { ArrowRight, CheckCircle, HandHeart, LoaderCircle, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Confetti from "react-confetti";
import useUser from "../lib/Zustand";
import UseCartStore from "../stores/useCartStore.jsx";
import { confirmPurchase } from "../lib/confirmPurchase.js";

const PurchaseSuccessPage = () => {
	const clearCart = useUser((state) => state.clearCart);
	const pendingOrderId = useUser((state) => state.pendingOrderId);
	const setPendingOrderId = useUser((state) => state.setPendingOrderId);
	const { confirmPayment, clearCartOnServer } = UseCartStore();

	const [status, setStatus] = useState("checking");
	const [error, setError] = useState(null);
	const [orderId, setOrderId] = useState(null);
	const [cartCleared, setCartCleared] = useState(true);


	const confirmationRequested = useRef(false);

	useEffect(() => {
		if (confirmationRequested.current) return;
		confirmationRequested.current = true;

		const orderIdParam = new URLSearchParams(window.location.search).get("orderId");
		const orderToConfirm = orderIdParam || pendingOrderId;

		if (!orderToConfirm) {
			setStatus("unconfirmed");
			return;
		}

		confirmPurchase({
			orderId: orderToConfirm,
			confirmPayment,
			clearCart,
			clearCartOnServer,
			clearPendingOrder: () => setPendingOrderId(null),
		})
			.then((result) => {
				setOrderId(result.orderId);
				setCartCleared(result.cartCleared);
				setStatus("paid");
			})
			.catch((confirmError) => {
				setError(confirmError.message);
				setStatus("failed");
			});

	}, [pendingOrderId]);

	return (
		<div className='min-h-screen flex items-center justify-center px-4'>
			{status === "paid" && (
				<Confetti
					width={window.innerWidth}
					height={window.innerHeight}
					gravity={0.1}
					style={{ zIndex: 99 }}
					numberOfPieces={700}
					recycle={false}
				/>
			)}

			<div className='max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10'>
				<div className='p-6 sm:p-8'>
					{status === "checking" && (
						<>
							<div className='flex justify-center'>
								<LoaderCircle className='text-gray-400 w-16 h-16 mb-4 animate-spin' />
							</div>
							<h1 className='text-2xl sm:text-3xl font-bold text-center text-gray-300 mb-2'>
								Confirming your payment
							</h1>
							<p className='text-gray-300 text-center'>
								Hold on while we verify the payment with our payment provider.
							</p>
						</>
					)}

					{status === "paid" && (
						<>
							<div className='flex justify-center'>
								<CheckCircle className='text-emerald-400 w-16 h-16 mb-4' />
							</div>
							<h1 className='text-2xl sm:text-3xl font-bold text-center text-emerald-400 mb-2'>
								Purchase Successful!
							</h1>

							<p className='text-gray-300 text-center mb-2'>
								Thank you for your order. {"We&apos;"}re processing it now.
							</p>
							<p className='text-emerald-400 text-center text-sm mb-6'>
								Check your email for order details and updates.
							</p>

							{!cartCleared && (
								<p className='text-amber-400 text-center text-sm mb-4'>
									Your payment went through, but we could not clear your cart. Please empty it
									manually.
								</p>
							)}

							<div className='bg-gray-700 rounded-lg p-4 mb-6'>
								<div className='flex justify-between mb-2'>
									<span className='text-sm text-gray-400'>Order number</span>
									<span className='text-sm font-semibold text-emerald-400'>
										#{orderId ? orderId.slice(-8).toUpperCase() : "—"}
									</span>
								</div>
								<div className='flex justify-between'>
									<span className='text-sm text-gray-400'>Estimated delivery</span>
									<span className='text-sm font-semibold text-emerald-400'>3-5 business days</span>
								</div>
							</div>

							<div className='space-y-4'>
								<button
									className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4
                rounded-lg transition duration-300 flex items-center justify-center'
								>
									<HandHeart className='mr-2' size={18} />
									Thanks for trusting us!
								</button>
								<Link
									to={"/"}
									className='w-full bg-gray-700 hover:bg-gray-600 text-emerald-400 font-bold py-2 px-4
                rounded-lg transition duration-300 flex items-center justify-center'
								>
									Continue Shopping
									<ArrowRight className='ml-2' size={18} />
								</Link>
							</div>
						</>
					)}

					{status === "unconfirmed" && (
						<>
							<div className='flex justify-center'>
								<XCircle className='text-gray-400 w-16 h-16 mb-4' />
							</div>
							<h1 className='text-2xl sm:text-3xl font-bold text-center text-gray-300 mb-2'>
								Nothing to confirm
							</h1>
							<p className='text-gray-300 text-center mb-6'>
								There is no payment waiting to be confirmed. Your cart has not been changed.
							</p>
							<Link
								to={"/cart"}
								className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4
                rounded-lg transition duration-300 flex items-center justify-center'
							>
								Go to cart
								<ArrowRight className='ml-2' size={18} />
							</Link>
						</>
					)}

					{status === "failed" && (
						<>
							<div className='flex justify-center'>
								<XCircle className='text-red-500 w-16 h-16 mb-4' />
							</div>
							<h1 className='text-2xl sm:text-3xl font-bold text-center text-red-500 mb-2'>
								Payment Not Confirmed
							</h1>
							<p className='text-gray-300 text-center mb-2'>
								We could not verify this payment, so your order was not completed.
							</p>
							<p className='text-gray-400 text-center text-sm mb-6'>
								{error || "No charge was made and your cart is unchanged."}
							</p>
							<div className='space-y-4'>
								<Link
									to={"/cart"}
									className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4
                rounded-lg transition duration-300 flex items-center justify-center'
								>
									Return to cart
									<ArrowRight className='ml-2' size={18} />
								</Link>
								<Link
									to={"/"}
									className='w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-2 px-4
                rounded-lg transition duration-300 flex items-center justify-center'
								>
									Continue Shopping
								</Link>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};
export default PurchaseSuccessPage;
