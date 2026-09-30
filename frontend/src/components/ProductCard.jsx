import { useState } from "react";
import toast from "react-hot-toast";
import { ShoppingCart, Loader } from "lucide-react";
import UseCartStore from "../stores/useCartStore.jsx"

const ProductCard = ({ product }) => {
	const {addToCart, refreshCart}=UseCartStore()
	const [isAdding, setIsAdding] = useState(false)

	const available = Number(product.quantity ?? 0)
	const outOfStock = available <= 0

const handleAddToCart =async(e, product)=>{
	if (outOfStock || isAdding) return

	setIsAdding(true)
	try {
		await addToCart(product)
		await refreshCart()
		toast.success("Product added to cart")
	} catch (error) {
		toast.error(error.message || "Unable to add product to cart")
	} finally {
		setIsAdding(false)
	}
}

	return (
		<div className='flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg'>
			<div className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl'>
				<img className='object-cover w-full' src={product.image} alt='product image' />
				<div className='absolute inset-0 bg-black bg-opacity-20' />
				{outOfStock && (
					<span className='absolute top-3 left-3 inline-flex items-center rounded-full px-2 py-0.5
						text-xs font-medium bg-red-900/70 text-red-200'>
						Out of stock
					</span>
				)}
			</div>

			<div className='mt-4 px-5 pb-5'>
				<h5 className='text-xl font-semibold tracking-tight text-white'>{product.name}</h5>
				<div className='mt-2 mb-5 flex items-center justify-between'>
					<p>
						<span className='text-3xl font-bold text-emerald-400'>${product.price}</span>
					</p>
					{!outOfStock && (
						<span className='text-sm text-gray-400'>{available} available</span>
					)}
				</div>
				<button
					disabled={outOfStock || isAdding}
					className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5
						text-center text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none
						focus:ring-4 focus:ring-emerald-300 disabled:cursor-not-allowed disabled:bg-gray-600
						disabled:hover:bg-gray-600'
					onClick={(e) => handleAddToCart(e, product)}
					>
					{isAdding ? (
						<>
							<Loader size={22} className='mr-2 animate-spin' />
							Adding...
						</>
					) : (
						<>
							<ShoppingCart size={22} className='mr-2' />
							Add to cart
						</>
					)}
				</button>
			</div>
		</div>
	);
};
export default ProductCard;
