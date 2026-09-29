const PAYMENT_MODE = process.env.PAYMENT_MODE || "none";









export const verifyPayment = async ({ order, paymentReference }) => {
    if (process.env.NODE_ENV === "production" && PAYMENT_MODE !== "none") {
        throw new Error(`Payment mode "${PAYMENT_MODE}" is not allowed in production`);
    }

    if (PAYMENT_MODE === "mock") {
        return { provider: "mock", reference: paymentReference || `mock_${order._id}` };
    }

    throw new Error("No payment provider is configured");
};
