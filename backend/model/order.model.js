import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		products: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
					min: 1,
				},
				price: {
					type: Number,
					required: true,
					min: 0,
				},
			},
		],
		totalAmount: {
			type: Number,
			required: true,
			min: 0,
		},
		
		status: {
			type: String,
			enum: ["pending", "paid", "failed", "canceled"], // Allowed statuses
			default: "pending", // Set default to "pending"
		},
	},
	{ timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
