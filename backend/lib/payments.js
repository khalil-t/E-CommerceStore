const PAYMENT_MODE = process.env.PAYMENT_MODE || "none";

// The single place where an order is declared paid. The browser can send anything in the
// request body, so a value from req.body is never proof of payment.
//
// TODO: connect Stripe. Replace the mock branch with a server-side lookup:
// const intent = await stripe.paymentIntents.retrieve(paymentReference);
// if (intent.status !== "succeeded") throw new Error("Payment not completed");
// return { provider: "stripe", reference: intent.id };

export const verifyPayment = async ({ order, paymentReference }) => {
    if (process.env.NODE_ENV === "production" && PAYMENT_MODE !== "none") {
        throw new Error(`Payment mode "${PAYMENT_MODE}" is not allowed in production`);
    }

    if (PAYMENT_MODE === "mock") {
        return { provider: "mock", reference: paymentReference || `mock_${order._id}` };
    }

    throw new Error("No payment provider is configured");
};
