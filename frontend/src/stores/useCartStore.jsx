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

const addToCart=async(Cart)=>{
try{
    const{_id}= Cart
    const { response, body } = await authFetch(import.meta.env.VITE_APP_ADDTOCART, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      body: JSON.stringify({_id}),
      });

      if (!response.ok) {
        throw new Error('Failed ');
      }
    
      const data = body
   
}
catch (error) {
    console.log("Error in addToCart:", error.message);
}
}

const removeAllFromCart=async(productId)=>{
try{
    const { response, body } = await authFetch(`${import.meta.env.VITE_APP_REMOVEALLFROMCART}/${productId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        });

      if (!response.ok) {
        throw new Error('Failed to sign up');
      }
      const data = body
      console.log(data)

}
 
     catch (error) {
        console.log("Error in removeAllFromCart:", error.message);
    }
}


const updateQuantity =async(quantity, productId)=>{
try{
    const { response, body } = await authFetch(`${import.meta.env.VITE_APP_UPDATEQUANTITY}/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity}),
      });

      if (!response.ok) {
        throw new Error('Failed to updateQuantity');
      }
    
      const data = body


}
catch (error) {
    console.log("Error in updateQuantity:", error.message);
}
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

const getCheckoutQuote=async(cartItems)=>{
  const products =cartItems.map((item) => ({
  product: item._id,
  quantity: item.quantity
}));

    const { response, body } = await authFetch(import.meta.env.VITE_APP_CHECKOUT_QUOTE, {
        method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({products}),
      });

      if (!response.ok) {
        const error = body || {};
        throw new Error(error.error || "Failed to get the cart total");
    }

    return body
}

const createCheckoutSession=async(cartItems)=>{
  const products =cartItems.map((item) => ({
  product: item._id,
  quantity: item.quantity
}));

    const { response, body } = await authFetch(import.meta.env.VITE_APP_CHECKOUT, {
        method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({products}),
      });

      if (!response.ok) {
        const error = body || {};
        throw new Error(error.error || "Failed to start checkout");
    }

    const data = body
return data
}

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

 return{getCartProducts , addToCart , removeAllFromCart , updateQuantity,fetchRecommendedProducts , getCheckoutQuote, createCheckoutSession, clearCartOnServer, confirmPayment}   
}
export default UseCartStore