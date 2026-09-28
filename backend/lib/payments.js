const PAYMENT_MODE = process.env.PAYMENT_MODE || "none";

// The single place where "this order was actually paid for" is decided.
// Every path that sets order.status = "paid" must go through verifyPayment().
//
// The browser can send whatever it likes in the request body, so a value
// coming from req.body is never proof of payment on its own.
//
// TODO: connect Stripe. Replace the mock branch with a server-side lookup:
//   const intent = await stripe.paymentIntents.retrieve(paymentReference);
//   if (intent.status !== "succeeded") throw new Error("Payment not completed");
//   return { provider: "stripe", reference: intent.id };
// Keep the lookup here so no other controller has to know how payments work.

export const verifyPayment = async ({ order, paymentReference }) => {
    if (process.env.NODE_ENV === "production" && PAYMENT_MODE !== "none") {
        throw new Error(`Payment mode "${PAYMENT_MODE}" is not allowed in production`);
    }

    if (PAYMENT_MODE === "mock") {
        return { provider: "mock", reference: paymentReference || `mock_${order._id}` };
    }

    throw new Error("No payment provider is configured");
};
