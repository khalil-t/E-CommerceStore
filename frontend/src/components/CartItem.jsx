import { Minus, Plus, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import UseCartStore from "../stores/useCartStore.jsx"
import useUser from "../lib/Zustand.jsx";
import {
	canDecreaseQuantity,
	canIncreaseQuantity,
	formatCurrency,
	getAvailableQuantity,
	getLinePrice,
	getLineQuantity,
	getNextQuantity,
} from "../lib/cartTotals.js";

const CartItem = ({ item }) => {
	const { removeAllFromCart, updateQuantity, refreshCart } = UseCartStore()
	const [busy, setBusy] = useState(false)
	const deleteCartItem = useUser((state) => state.deleteCartItem);
	const updateCart = useUser((state) => state.updateCart);

	const available = getAvailableQuantity(item)
	const current = getLineQuantity(item)
	const canDecrease = canDecreaseQuantity(item)
	const canIncrease = canIncreaseQuantity(item)
	const lineTotal = getLinePrice(item) * current

	const handleQuantityChange = async (requested) => {
		if (busy) return

		const next = getNextQuantity(item, requested)

		if (next === current) return

		setBusy(true)
		updateCart(item._id, next)

		try {
			await updateQuantity(next, item._id)
		} catch (error) {
			updateCart(item._id, current)
			toast.error(error.message || "Unable to update quantity")
			await refreshCart()
		} finally {
			setBusy(false)
		}
	}

	const handleRemove = async () => {
		if (busy) return

		setBusy(true)
		try {
			await removeAllFromCart(item._id)
			deleteCartItem(item._id)
			await refreshCart()
			toast.success(`${item.name} removed from your cart`)
		} catch (error) {
			toast.error(error.message || "Unable to remove this item")
			await refreshCart()
		} finally {
			setBusy(false)
		}
	}

	return (
		<div className='rounded-lg border p-4 shadow-sm border-gray-700 bg-gray-800 md:p-6'>
			<div className='space-y-4 md:flex md:items-start md:justify-between md:gap-6 md:space-y-0'>
				<div className='shrink-0 md:order-1'>
					<img
						className='w-20 h-20 md:w-32 md:h-32 rounded object-cover'
						src={item.image}
						alt={item.name}
					/>
				</div>

				<div className='w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md'>
					<p className='text-base font-medium text-white'>{item.name}</p>
					<p className='text-sm text-gray-400'>{item.description}</p>
					<p className='text-xs text-gray-500'>
						{formatCurrency(getLinePrice(item))}
						{current > 1 ? ` each · ${formatCurrency(lineTotal)} for ${current}` : ''}
					</p>
					<p className='text-xs text-gray-500'>
						{available > 0 ? `${available} available` : 'Out of stock'}
					</p>

					<button
						type='button'
						disabled={busy}
						aria-label={`Remove ${item.name} from cart`}
						className='inline-flex items-center gap-2 text-sm font-medium text-red-400 transition
							hover:text-red-300 hover:underline focus:outline-none focus:ring-2
							focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded
							disabled:cursor-not-allowed disabled:opacity-50'
						onClick={handleRemove}
					>
						<Trash size={16} aria-hidden='true' />
						Remove
					</button>
				</div>

				<div className='flex items-center justify-between gap-4 md:order-3 md:flex-col md:items-end md:gap-2'>
					<div className='flex items-center gap-3'>
						<label className='sr-only' htmlFor={`quantity-${item._id}`}>
							Quantity for {item.name}
						</label>
						<button
							type='button'
							disabled={!canDecrease || busy}
							aria-label={`Decrease quantity of ${item.name}`}
							className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border
							 border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2
							 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50'
							onClick={() => handleQuantityChange(current - 1)}
						>
							<Minus className='text-gray-300' aria-hidden='true' />
						</button>
						<p
							id={`quantity-${item._id}`}
							className='min-w-6 text-center text-base font-medium text-white'
						>
							{current}
						</p>
						<button
							type='button'
							disabled={!canIncrease || busy}
							aria-label={`Increase quantity of ${item.name}`}
							className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border
							 border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2
							 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50'
							onClick={() => handleQuantityChange(current + 1)}
						>
							<Plus className='text-gray-300' aria-hidden='true' />
						</button>
					</div>

					<p className='text-end text-base font-bold text-emerald-400'>
						{formatCurrency(lineTotal)}
					</p>
				</div>
			</div>
		</div>
	);
};
export default CartItem;
