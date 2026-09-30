import useUser from "../lib/Zustand";
import { authFetch } from "../lib/authFetch.js";


const UseCartStore=()=>{

const getCartProducts=async()=>{
try{
    const { body } = await authFetch(import.meta.env.VITE_APP_GETCARTPRODUCTS, {
        method: "GET",
      headers: { "Content-Type": "application/json" },
      });
    const data = body
return data
}
catch (error) {
    console.log("Error in getCartProducts:", error.message);
}
}

const refreshCart=async()=>{
	try {
		const data = await getCartProducts()
		const items = Array.isArray(data) ? data : []
		useUser.getState().setCartItems(items)
		return items
	} catch {
		return useUser.getState().cartItems
	}
}

const addToCart=async(Cart)=>{
const{_id}= Cart
    const { response, body } = await authFetch(import.meta.env.VITE_APP_ADDTOCART, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      body: JSON.stringify({_id}),
      });

      if (!response.ok) {
        throw new Error(body?.message || "Unable to add product to cart");
      }

      return body
}

const removeAllFromCart=async(productId)=>{
    const { response, body } = await authFetch(`${import.meta.env.VITE_APP_REMOVEALLFROMCART}/${productId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        });

      if (!response.ok) {
        throw new Error(body?.message || "Failed to remove item from cart");
      }

      return body
}


const updateQuantity =async(quantity, productId)=>{
    const { response, body } = await authFetch(`${import.meta.env.VITE_APP_UPDATEQUANTITY}/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity}),
      });

      if (!response.ok) {
        throw new Error(body?.message || "Failed to updateQuantity");
      }

      return body
}



 const fetchRecommendedProducts = async () => {
  try {
    const { response, body } = await authFetch(`${import.meta.env.VITE_APP_GET_RECOMMENDED_PRODUCTS}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recommended products");
    }

    const data = body;
    return data;
  } catch (error) {
    console.error("Error in fetchRecommendedProducts:", error.message);
    return [];
  }
};

const clearCartOnServer = async () => {
  const { response, body } = await authFetch(import.meta.env.VITE_APP_REMOVEALLFROMCART, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    });

  if (!response.ok) {
    const error = body || {};
    throw new Error(error.message || "Failed to clear the cart");
  }
};

const confirmPayment = async (orderId) => {
  const { response, body } = await authFetch(import.meta.env.VITE_APP_CHECKOUT_SUCCESS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
  });

  if (!response.ok) {
    const error = body || {};
    throw new Error(error.error || "Payment could not be confirmed");
  }

  return body;
};

 return{getCartProducts , refreshCart, addToCart , removeAllFromCart , updateQuantity,fetchRecommendedProducts , clearCartOnServer, confirmPayment}   
}
export default UseCartStore