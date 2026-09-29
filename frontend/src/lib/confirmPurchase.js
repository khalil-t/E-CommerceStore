export const confirmPurchase = async ({
	orderId,
	confirmPayment,
	clearCart,
	clearCartOnServer,
	clearPendingOrder,
}) => {
	const result = await confirmPayment(orderId);

	clearPendingOrder();

	let cartCleared = true;
	try {
		await clearCartOnServer();
		clearCart();
	} catch {
		cartCleared = false;
	}

	return { orderId: result.orderId, cartCleared };
};

export default confirmPurchase;
