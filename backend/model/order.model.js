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
			type: String, // Payment provider reference, e.g. a Stripe PaymentIntent id
			default: null,
		},
	},
	{ timestamps: true }
);

// At most one active checkout per user, enforced by the index rather than the controller so
// concurrent requests cannot both insert.
orderSchema.index({ user: 1 }, {
	unique: true,
	partialFilterExpression: { status: "pending" },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
