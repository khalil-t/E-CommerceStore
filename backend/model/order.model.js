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

		paymentReference: {
			type: String, // Payment provider reference, e.g. a Stripe PaymentIntent id
			default: null,
		},
	},
	{ timestamps: true }
);

// A user has at most one active checkout. Enforced by the database rather than by
// the controller, so two concurrent checkout requests cannot both insert a pending
// order no matter how the read-then-write in the controller interleaves.
orderSchema.index({ user: 1 }, {
	unique: true,
	partialFilterExpression: { status: "pending" },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
