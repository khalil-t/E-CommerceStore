export const MIN_CART_QUANTITY = 1;

const toNonNegativeInt = (value) => {
	const parsed = Number(value);
	if (!Number.isFinite(parsed)) return 0;
	return Math.max(0, Math.floor(parsed));
};

const toPrice = (value) => {
	const parsed = Number(value);
	if (!Number.isFinite(parsed) || parsed < 0) return 0;
	return parsed;
};

export const getLineQuantity = (item) =>
	Math.max(MIN_CART_QUANTITY, toNonNegativeInt(item?.quantity));

export const getLinePrice = (item) => toPrice(item?.price);

export const getLineTotal = (item) => getLinePrice(item) * getLineQuantity(item);

export const getCartItemCount = (items) =>
	Array.isArray(items)
		? items.reduce((total, item) => total + getLineQuantity(item), 0)
		: 0;

export const getCartSubtotal = (items) =>
	Array.isArray(items)
		? items.reduce((total, item) => total + getLineTotal(item), 0)
		: 0;

export const getAvailableQuantity = (item) => toNonNegativeInt(item?.availableQuantity);

export const canDecreaseQuantity = (item) => getLineQuantity(item) > MIN_CART_QUANTITY;

export const canIncreaseQuantity = (item) => {
	const available = getAvailableQuantity(item);
	return available > 0 && getLineQuantity(item) < available;
};

export const getNextQuantity = (item, requested) => {
	const available = getAvailableQuantity(item);
	const max = Math.max(MIN_CART_QUANTITY, available);
	return Math.min(Math.max(toNonNegativeInt(requested), MIN_CART_QUANTITY), max);
};

export const formatCurrency = (value) => {
	const parsed = Number(value);
	return `$${(Number.isFinite(parsed) && parsed > 0 ? parsed : 0).toFixed(2)}`;
};
