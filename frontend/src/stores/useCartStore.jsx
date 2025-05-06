
const UseCartStore=()=>{

const getCartProducts=async()=>{
try{
    const response = await fetch(import.meta.env.VITE_APP_GETCARTPRODUCTS, {
        method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      });
      const data= await response.json()
      console.log(data)
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