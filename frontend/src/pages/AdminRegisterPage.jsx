import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, User, ArrowRight, Loader } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import useUserStore from "../stores/useUserStore";
import useUser from "../lib/Zustand";

/**
 * First store owner setup. This form has no role field on purpose: the backend decides the role,
 * and the endpoint refuses once an admin already exists. The closed message comes from the server
 * so the page never has to know the current bootstrap state.
 */
const AdminRegisterPage = () => {
	const setUser = useUser((state) => state.setUser);
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const { AdminRegister } = useUserStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const data = await AdminRegister(formData);
			setUser(data);
			toast.success("Admin account created");
			navigate("/admin");
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
			<motion.div
				className='sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<h2 className='mt-6 text-center text-3xl font-extrabold text-emerald-400'>
					Set up the store owner
				</h2>
				<p className='mt-2 text-center text-sm text-gray-400'>
					This one-time form creates the first administrator. It closes as soon as an admin
					exists.
				</p>
			</motion.div>

			<motion.div
				className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.2 }}
			>
				<div className='bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'>
					<form className='space-y-6' onSubmit={handleSubmit}>
						<div>
							<label htmlFor='name' className='block text-sm font-medium text-gray-300'>
								Full name
							</label>
							<div className='mt-1 relative'>
								<User className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
								<input
									id='name'
									name='name'
									type='text'
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									className='pl-10 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
									required
								/>
							</div>
						</div>

						<div>
							<label htmlFor='email' className='block text-sm font-medium text-gray-300'>
								Email
							</label>
							<div className='mt-1 relative'>
								<Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
								<input
									id='email'
									name='email'
									type='email'
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									className='pl-10 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
									required
								/>
							</div>
						</div>

						<div>
							<label htmlFor='password' className='block text-sm font-medium text-gray-300'>
								Password
							</label>
							<div className='mt-1 relative'>
								<Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
								<input
									id='password'
									name='password'
									type='password'
									value={formData.password}
									onChange={(e) => setFormData({ ...formData, password: e.target.value })}
									className='pl-10 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
									minLength='6'
									required
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor='confirmPassword'
								className='block text-sm font-medium text-gray-300'
							>
								Confirm password
							</label>
							<div className='mt-1 relative'>
								<Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
								<input
									id='confirmPassword'
									name='confirmPassword'
									type='password'
									value={formData.confirmPassword}
									onChange={(e) =>
										setFormData({ ...formData, confirmPassword: e.target.value })
									}
									className='pl-10 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
									minLength='6'
									required
								/>
							</div>
						</div>

						<button
							type='submit'
							disabled={loading}
							className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
						>
							{loading ? (
								<Loader className='h-5 w-5 animate-spin' />
							) : (
								<>
									<ShieldCheck className='mr-2 h-5 w-5' />
									Create admin account
								</>
							)}
						</button>
					</form>
				</div>
			</motion.div>

			<div className='mt-6 text-center'>
				<Link
					to='/login'
					className='text-emerald-400 hover:text-emerald-300 text-sm flex items-center justify-center'
				>
					<ArrowRight className='h-4 w-4 mr-1' />
					Back to login
				</Link>
			</div>
		</div>
	);
};

export default AdminRegisterPage;
