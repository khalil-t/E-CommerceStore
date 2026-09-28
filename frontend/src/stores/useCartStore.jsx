import useUser from "../lib/Zustand";


const UseCartStore=()=>{

const getCartProducts=async()=>{
try{
    const response = await fetch(import.meta.env.VITE_APP_GETCARTPRODUCTS, {
        method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      });
      const data= await response.json()
return data
}
catch (error) {
    console.log("Error in getCartProducts:", error.message);
}
}

const addToCart=async(Cart)=>{
try{
    const{_id}= Cart
    const response = await fetch(import.meta.env.VITE_APP_ADDTOCART, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include', 
        body: JSON.stringify({_id}),
      });

      if (!response.ok) {
        throw new Error('Failed ');
      }
    
      const data= await response.json()
   
}
catch (error) {
    console.log("Error in addToCart:", error.message);
}
}

const removeAllFromCart=async(productId)=>{
try{
    const response = await fetch(`${import.meta.env.VITE_APP_REMOVEALLFROMCART}/${productId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: 'include', 
      });

      if (!response.ok) {
        throw new Error('Failed to sign up');
      }
      const data= await response.json()
      console.log(data)

}
 
     catch (error) {
        console.log("Error in removeAllFromCart:", error.message);
    }
}


const updateQuantity =async(quantity, productId)=>{
try{
    const response = await fetch(`${import.meta.env.VITE_APP_UPDATEQUANTITY}/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: 'include', 
        body: JSON.stringify({ quantity}),
      });

      if (!response.ok) {
        throw new Error('Failed to updateQuantity');
      }
    
      const data= await response.json()


}
catch (error) {
    console.log("Error in updateQuantity:", error.message);
}
}



 const fetchRecommendedProducts = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_GET_RECOMMENDED_PRODUCTS}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // use only if needed (e.g., for cookies)
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recommended products");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in fetchRecommendedProducts:", error.message);
    return [];
  }
};

// Read-only. Asks the backend to price the cart from the database. Safe to call
// on every render or cart change: it creates no Order.
const getCheckoutQuote=async(cartItems)=>{
  const products =cartItems.map((item) => ({
  product: item._id,
  quantity: item.quantity
}));

    const response = await fetch(import.meta.env.VITE_APP_CHECKOUT_QUOTE, {
        method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({products}),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "Failed to get the cart total");
    }

    return await response.json()
}

// Creates checkout state. Must only be called from an explicit user action.
const createCheckoutSession=async(cartItems)=>{
  const products =cartItems.map((item) => ({
  product: item._id,
  quantity: item.quantity
}));

    const response = await fetch(import.meta.env.VITE_APP_CHECKOUT, {
        method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({products}),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "Failed to start checkout");
    }

    const data= await response.json()
return data
}

 return{getCartProducts , addToCart , removeAllFromCart , updateQuantity,fetchRecommendedProducts , getCheckoutQuote, createCheckoutSession}   
}
export default UseCartStore