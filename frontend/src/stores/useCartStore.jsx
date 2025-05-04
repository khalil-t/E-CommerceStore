
const UseCartStore=()=>{

const getCartProducts=async()=>{
try{
    const response = await fetch(import.meta.env.VITE_APP_GetCartProducts, {
        method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      });
      const data= await response.json()

}
catch (error) {
    console.log("Error in getCartProducts:", error.message);
}
}

const addToCart=async(Cart)=>{
try{
    const{productId}= Cart
     
    const response = await fetch(import.meta.env.VITE_APP_addToCart, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include', 
        body: JSON.stringify({ productId}),
      });

      if (!response.ok) {
        throw new Error('Failed ');
      }
    
      const data= await response.json()
      console.log(data)
   
}
catch (error) {
    console.log("Error in addToCart:", error.message);
}
}

const removeAllFromCart=async(productId)=>{
try{
    const response = await fetch(`${import.meta.env.VITE_APP_removeAllFromCart}/${productId}`, {
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


const updateQuantity =async(Cartdata, productId)=>{
try{
const {quantity}=Cartdata
    const response = await fetch(`${import.meta.env.VITE_APP_updateQuantity}/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: 'include', 
        body: JSON.stringify({ quantity}),
      });

      if (!response.ok) {
        throw new Error('Failed to sign up');
      }
    
      const data= await response.json()
      console.log(data)


}
catch (error) {
    console.log("Error in updateQuantity:", error.message);
}
}

 return{getCartProducts , addToCart , removeAllFromCart , updateQuantity}   
}
export default UseCartStore