import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import AdminRegisterPage from "./pages/AdminRegisterPage";
import CategoryPage from "./pages/CategoryPage";

import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import CartPage from "./pages/CartPage";

import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";
import useUserStore from "./stores/useUserStore";
 import useUser from "./lib/Zustand";
function App() {
	const setUser = useUser((state) => state.setUser);  
	const clearUser = useUser((state) => state.clearUser);
	const user = useUser((state) => state.user);
	const isAuthChecked = useUser((state) => state.isAuthChecked);
const {getUser}= useUserStore()

	useEffect(() => {
		const restoreSession = async () => {
			const sessionUser = await getUser();
			if (sessionUser) {
				setUser(sessionUser);
			} else {
				clearUser();
			}
			useUser.getState().setIsAuthChecked(true);
		};

		restoreSession();
	}, []);


	const requireAdmin = ({ children }) => {
		if (!isAuthChecked) return <LoadingSpinner />;
		if (!user) return <Navigate to='/login' />;
		if (user.role !== 'admin') return <Navigate to='/' />;
		return children;
	};

	const requireUser = ({ children }) => {
		if (!isAuthChecked) return <LoadingSpinner />;
		if (!user) return <Navigate to='/login' />;
		return children;
	};

	return (
		<div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
			<div className='absolute inset-0 overflow-hidden'>
				<div className='absolute inset-0'>
					<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
				</div>
			</div>

			<div className='relative z-50 pt-20'>
				<Navbar />
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to='/' />} />
					<Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' />} />
					<Route path='/secret-dashboard' element={requireAdmin({ children: <AdminPage /> })} />
					<Route path='/admin' element={requireAdmin({ children: <AdminPage /> })} />
					<Route path='/admin/register' element={!user ? <AdminRegisterPage /> : <Navigate to='/' />} />
					<Route path='/category/:category' element={<CategoryPage />} />
					<Route path='/cart' element={requireUser({ children: <CartPage /> })} />
					<Route
						path='/purchase-success'
						element={requireUser({ children: <PurchaseSuccessPage /> })}
					/>
					<Route path='/purchase-cancel' element={requireUser({ children: <PurchaseCancelPage /> })} />
				</Routes>
			</div>
			<Toaster />
		</div>
	);
}

export default App;
