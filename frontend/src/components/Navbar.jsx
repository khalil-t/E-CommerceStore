import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import useUserStore from "../stores/useUserStore"
import usUseCartStore from "../stores/useCartStore.jsx"
import useUser from "../lib/Zustand.jsx"
import { getCartItemCount } from "../lib/cartTotals.js"
import { useEffect } from "react";



const Navbar = () => {
const {refreshCart} = usUseCartStore()
const cartItems = useUser((state) => state.cartItems)

const cartCount = getCartItemCount(cartItems)

	const { Logout}= useUserStore()

	const user = useUser((state) => state.user);
	const isAuthChecked = useUser((state) => state.isAuthChecked);
    const clearUser = useUser((state)=>state.clearUser)

useEffect(()=>{
	if (user) {
		refreshCart()
	} else {
		useUser.getState().setCartItems([])
	}
	// eslint-disable-next-line react-hooks/exhaustive-deps
}, [user?.email])

	
	const isAdmin = isAuthChecked && user?.role === "admin";
	return (
		<header className='fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800'>
		<div className='container mx-auto px-4 py-3'>
			<div className='flex flex-wrap justify-between items-center'>
				<Link to='/' className='text-2xl font-bold text-emerald-400 items-center space-x-2 flex'>
					E-Commerce
				</Link>

				<nav className='flex flex-wrap items-center gap-4'>
					<Link
						to={"/"}
						className='text-gray-300 hover:text-emerald-400 transition duration-300
				 ease-in-out'
					>
						Home
					</Link>
					{user && (
						<Link
							to={"/cart"}
							aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
							className='group flex items-center gap-2 rounded-md border border-gray-700 bg-gray-800 px-3
								py-2 text-gray-300 hover:border-emerald-500 hover:text-emerald-400 transition
								duration-300 ease-in-out'
						>
							<ShoppingCart className='shrink-0' size={20} />
							<span>Cart</span>
							<span
								className={`rounded-full px-2 py-0.5 text-xs font-medium transition duration-300 ease-in-out ${
									cartCount > 0
										? "bg-emerald-500 text-white group-hover:bg-emerald-400"
										: "bg-gray-700 text-gray-400"
								}`}
							>
								{cartCount}
							</span>
						</Link>
					)}
					{isAdmin && (
						<Link
							className='bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
							 transition duration-300 ease-in-out flex items-center'
							to={"/secret-dashboard"}
						>
							<Lock className='inline-block mr-1' size={18} />
							<span className=' sm:inline'>Dashboard</span>
						</Link>
					)}

					{user ? (
						<button
							className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
					rounded-md flex items-center transition duration-300 ease-in-out'
					onClick={() => {
						clearUser();
						Logout();
					  }}
					  



						>
							<LogOut size={18} />
							<span className=' sm:inline ml-2'>Log Out</span>
						</button>
					) : (
						<>
							<Link
								to={"/signup"}
								className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 
								rounded-md flex items-center transition duration-300 ease-in-out'
							>
								<UserPlus className='mr-2' size={18} />
								Sign Up
							</Link>
							<Link
								to={"/login"}
								className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
								rounded-md flex items-center transition duration-300 ease-in-out'
							>
								<LogIn className='mr-2' size={18} />
								Login
							</Link>
						</>
					)}
				</nav>
			</div>
		</div>
	</header>
	);
};
export default Navbar;