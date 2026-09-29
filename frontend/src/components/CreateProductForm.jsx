import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader, CheckCircle2, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import useUser from "../lib/Zustand.jsx"
import useProductStore from "../stores/useProductStore.jsx"
const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];

const emptyForm = {
	name: "",
	description: "",
	price: "",
	quantity: "",
	image: "",
	category: "",
};

const validate = (formData) => {
	const errors = {};

	if (!formData.name.trim()) {
		errors.name = "Name is required";
	}

	if (!formData.description.trim()) {
		errors.description = "Description is required";
	}

	const price = formData.price.trim();
	if (price === "") {
		errors.price = "Price is required";
	} else if (!/^\d+(\.\d{1,2})?$/.test(price) || Number(price) <= 0) {
		errors.price = "Price must be greater than 0";
	}

	const quantity = formData.quantity.trim();
	if (quantity === "") {
		errors.quantity = "Quantity is required";
	} else if (!/^\d+$/.test(quantity)) {
		errors.quantity = "Quantity must be a whole number of 0 or more";
	}

	if (!formData.category) {
		errors.category = "Category is required";
	}

	if (!formData.image) {
		errors.image = "Image is required";
	}

	return errors;
};

const inputClass = (hasError) => `mt-1 block w-full bg-gray-700 border rounded-md shadow-sm py-2
						px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500 ${hasError ? "border-red-500" : "border-gray-600"}`;

const errorClass = "mt-1 text-sm text-red-500";

const CreateProductForm = () => {
	const addProduct = useUser((state) => state.addProduct);
	const { createProduct } = useProductStore()

	const [formData, setFormData] = useState(emptyForm);
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [createdProduct, setCreatedProduct] = useState(null);
	const [serverError, setServerError] = useState("");

	const updateField = (field) => (e) => {
		const value = e.target.value;
		setFormData((previous) => ({ ...previous, [field]: value }));
		setErrors((previous) => {
			if (!previous[field]) return previous;
			const next = { ...previous };
			delete next[field];
			return next;
		});
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onloadend = () => {
			setFormData((previous) => ({ ...previous, image: reader.result }));
			setErrors((previous) => {
				if (!previous.image) return previous;
				const next = { ...previous };
				delete next.image;
				return next;
			});
		};
		reader.readAsDataURL(file);
	};

	const resetForm = () => {
		setFormData(emptyForm);
		setErrors({});
		setServerError("");
		setCreatedProduct(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isSubmitting) return;

		const validationErrors = validate(formData);
		setErrors(validationErrors);
		setServerError("");

		if (Object.keys(validationErrors).length > 0) {
			toast.error("Please fix the highlighted fields");
			return;
		}

		setIsSubmitting(true);

		try {
			const product = await createProduct({
				...formData,
				price: Number(formData.price),
				quantity: Number(formData.quantity),
			});

			addProduct(product);
			setCreatedProduct(product);
			toast.success("Product created successfully");
		} catch (error) {
			setServerError(error.message || "Could not create product");
			toast.error("Could not create product");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (createdProduct) {
		return (
			<motion.div
				className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto text-center'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<CheckCircle2 className='mx-auto h-14 w-14 text-emerald-400' />
				<h2 className='mt-4 text-2xl font-semibold text-emerald-300'>Product created successfully</h2>
				<p className='mt-2 text-gray-300'>
					&quot;{createdProduct.name}&quot; has been added to your products.
				</p>

				<div className='mt-6 flex flex-col sm:flex-row justify-center gap-3'>
					<button
						type='button'
						onClick={resetForm}
						className='flex justify-center items-center py-2 px-4 border border-transparent rounded-md
						shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700
						focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
					>
						<PlusCircle className='mr-2 h-5 w-5' />
						Add Another Product
					</button>
				</div>
			</motion.div>
		);
	}

	return (
		<motion.div
			className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<h2 className='text-2xl font-semibold mb-6 text-emerald-300'>Create New Product</h2>

			{serverError && (
				<div role='alert' className='mb-4 flex items-start rounded-md bg-red-900/40 border border-red-700 p-3'>
					<XCircle className='h-5 w-5 text-red-400 shrink-0' />
					<div className='ml-2'>
						<p className='text-sm text-red-200 font-medium'>Could not create product.</p>
						<p className='text-sm text-red-300'>{serverError}</p>
					</div>
				</div>
			)}

			<form className='space-y-4' onSubmit={handleSubmit} noValidate>
				<div>
					<label htmlFor='name' className='block text-sm font-medium text-gray-300'>
						Product Name
					</label>
					<input
						type='text'
						id='name'
						name='name'
						value={formData.name}
						onChange={updateField('name')}
						className={inputClass(errors.name)}
						aria-invalid={Boolean(errors.name)}
						aria-describedby={errors.name ? 'name-error' : undefined}
					/>
					{errors.name && <p id='name-error' className={errorClass}>{errors.name}</p>}
				</div>

				<div>
					<label htmlFor='description' className='block text-sm font-medium text-gray-300'>
						Description
					</label>
					<textarea
						id='description'
						name='description'
						value={formData.description}
						onChange={updateField('description')}
						rows='3'
						className={inputClass(errors.description)}
						aria-invalid={Boolean(errors.description)}
						aria-describedby={errors.description ? 'description-error' : undefined}
					/>
					{errors.description && <p id='description-error' className={errorClass}>{errors.description}</p>}
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
						onChange={updateField('price')}
						step='0.01'
						min='0'
						className={inputClass(errors.price)}
						aria-invalid={Boolean(errors.price)}
						aria-describedby={errors.price ? 'price-error' : undefined}
					/>
					{errors.price && <p id='price-error' className={errorClass}>{errors.price}</p>}
				</div>

				<div>
					<label htmlFor='quantity' className='block text-sm font-medium text-gray-300'>
						Number of samples
					</label>
					<input
						type='number'
						id='quantity'
						name='quantity'
						value={formData.quantity}
						onChange={updateField('quantity')}
						step='1'
						min='0'
						className={inputClass(errors.quantity)}
						aria-invalid={Boolean(errors.quantity)}
						aria-describedby={errors.quantity ? 'quantity-error' : undefined}
					/>
					{errors.quantity && <p id='quantity-error' className={errorClass}>{errors.quantity}</p>}
				</div>

				<div>
					<label htmlFor='category' className='block text-sm font-medium text-gray-300'>
						Category
					</label>
					<select
						id='category'
						name='category'
						value={formData.category}
						onChange={updateField('category')}
						className={inputClass(errors.category)}
						aria-invalid={Boolean(errors.category)}
						aria-describedby={errors.category ? 'category-error' : undefined}
					>
						<option value=''>Select a category</option>
						{categories.map((category) => (
							<option key={category} value={category}>
								{category}
							</option>
						))}
					</select>
					{errors.category && <p id='category-error' className={errorClass}>{errors.category}</p>}
				</div>

				<div className='mt-1'>
					<div className='flex items-center'>
						<input type='file' id='image' className='sr-only' accept='image/*' onChange={handleImageChange} />
						<label
							htmlFor='image'
							className={`cursor-pointer bg-gray-700 py-2 px-3 border rounded-md shadow-sm text-sm leading-4 font-medium
							text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2
							focus:ring-emerald-500 ${errors.image ? "border-red-500" : "border-gray-600"}`}
						>
							<Upload className='h-5 w-5 inline-block mr-2' />
							Upload Image
						</label>

						{formData.image && <span className='ml-3 text-sm text-gray-400'>Image uploaded </span>}
					</div>
					{errors.image && <p id='image-error' className={errorClass}>{errors.image}</p>}
				</div>

				<button
					type='submit'
					disabled={isSubmitting}
					className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md
					shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
				>
					{isSubmitting ? (
						<>
							<Loader className='mr-2 h-5 w-5 animate-spin' />
							Creating Product...
						</>
					) : (
						<>
							<PlusCircle className='mr-2 h-5 w-5' />
							Create Product
						</>
					)}
				</button>
			</form>
		</motion.div>
	);
};
export default CreateProductForm;
