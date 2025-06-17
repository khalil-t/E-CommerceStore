import { useState , useEffect} from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import useUser from "../lib/Zustand.jsx"
import useProductStore from "../stores/useProductStore.jsx"
const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];

const CreateProductForm = () => {
	const productList = useUser((state) => state.productList);
	const addProduct = useUser((state) => state.addProduct);
	const setProductList = useUser((state) => state.setProductList);
	const UpdateProduct = useUser((state) => state.deleteProduct);
	
	useEffect(() => {
	  }, [productList]);

	const {createProduct}=useProductStore()
const [formData, setFormData] = useState({
	name: "", 
	description: "", 
	price: "", 
	image: "", 
	category: ""
	});

	const handlesubmit =async(e)=>{
		e.preventDefault()
await createProduct(formData)
		}
		const handleImageChange = (e) => {
			const file = e.target.files[0];
			if (file) {
				const reader = new FileReader();
	
				reader.onloadend = () => {
					setFormData({ ...formData, image: reader.result });
				};
	
				reader.readAsDataURL(file); // base64
			}
		};

	return (
		<motion.div
			className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<h2 className='text-2xl font-semibold mb-6 text-emerald-300'>Create New Product</h2>

			<form  className='space-y-4'>
				<div>
					<label htmlFor='name' className='block text-sm font-medium text-gray-300'>
						Product Name
					</label>
					<input
						type='text'
						id='name'
						name='name'
						value={formData.name}
						onChange={(e)=>{setFormData({...formData ,name:e.target.value })}}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
						required
					/>
				</div>

				<div>
					<label htmlFor='description' className='block text-sm font-medium text-gray-300'>
						Description
					</label>
					<textarea
						id='description'
						name='description'
						value={formData.description}
						onChange={(e)=>{setFormData({...formData ,description:e.target.value })}}
						rows='3'
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 
						 focus:border-emerald-500'
						required
					/>
				</div>

				<div>
					<label htmlFor='price' className='block text-sm font-medium text-gray-300'>
						Price
					</label>
					<input
						type='number'
						id='price'
						name='price'
						value={formData.price}
						onChange={(e)=>{setFormData({...formData ,price:e.target.value })}}
						step='0.01'
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
						 focus:border-emerald-500'
						required
					/>
				</div>

				<div>
					<label htmlFor='category' className='block text-sm font-medium text-gray-300'>
						Category
					</label>
					<select
						id='category'
						name='category'
						value={formData.category}
						onChange={(e)=>{setFormData({...formData ,category:e.target.value })}}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
						 shadow-sm py-2 px-3 text-white focus:outline-none 
						 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
						required
					>
						<option value=''>Select a category</option>
						{categories.map((category) => (
							<option key={category} value={category}>
								{category}
							</option>
						))}
					</select>
				</div>

				<div className='mt-1 flex items-center'>
					<input type='file' id='image' className='sr-only' accept='image/*' onChange={handleImageChange} />
					<label
						htmlFor='image'
						className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
					>
						<Upload className='h-5 w-5 inline-block mr-2' />
						Upload Image
					</label>

					{formData.image && <span className='ml-3 text-sm text-gray-400'>Image uploaded </span>}

				</div>

				<button
					type='submit'
					className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
					onClick={(e)=>{handlesubmit(e)}}

				>
					<>
							<PlusCircle className='mr-2 h-5 w-5' />
							Create Product
						</>
				</button>
			</form>
		</motion.div>
	);
};
export default CreateProductForm;