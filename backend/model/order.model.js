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
			enum: ["pending", "paid", "failed", "canceled"],
			default: "pending",
		},

		paymentReference: {
			type: String, 
			default: null,
		},
	},
	{ timestamps: true }
);



orderSchema.index({ user: 1 }, {
	unique: true,
	partialFilterExpression: { status: "pending" },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
