

import useUser from "../lib/Zustand"
import { authFetch } from "../lib/authFetch.js"

const useProductStore =()=>{
    const productList = useUser((state) => state.productList);
	const addProduct = useUser((state) => state.addProduct);
	const setProductList = useUser((state) => state.setProductList);
	const UpdateProduct = useUser((state) => state.UpdateProduct);
    const toggleFeaturedInStore = useUser((state) => state.toggleFeaturedInStore);
const { voucherCode, setVoucherCode } = useUser();


const getAllProducts=async()=>{
try{
    const { body } = await authFetch(import.meta.env.VITE_APP_PRODUCTS, {
        method: "GET",
      headers: { "Content-Type": "application/json" },
      });
      const data = body
      setProductList(data.products);
      return data;


}
catch (error) {
    console.log("Error in getAllProducts:", error.message);
  
}
}

const getFeaturedProducts=async()=>{
try{

    const { body } = await authFetch(import.meta.env.VITE_APP_products, {
        method: "GET",
      headers: { "Content-Type": "application/json" },
      });
      const data = body

}
    catch (error) {
        console.log("Error in getFeaturedProducts:", error.message);
    }
} 

const createProduct=async(product)=>{
    try{
     const{ name, description, price, image, category}= product
      
     const { response, body } = await authFetch(import.meta.env.VITE_APP_CREATEPRODUCT , {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, price, image, category}),
      });

      if (!response.ok) {
        throw new Error('Failed to createProduct');
      }
    
      const data = body
      console.log(data)
  
    }
        catch (error) {
            console.log("Error in createProduct:", error.message);
        }
}


const deleteProduct=async(productId)=>{
    try{

        const { body } = await authFetch(`${import.meta.env.VITE_APP_CREATEPRODUCT}/${productId}`, {
            method: "DELETE",
          headers: { "Content-Type": "application/json" },
          });
          const data = body
          UpdateProduct(data)
          console.log(data)
    
    }
        catch (error) {
            console.log("Error in deleteProduct:", error.message);
        }

}


const getProductsByCategory=async(category)=>{
    try{
        const { body } = await authFetch(`${import.meta.env.VITE_APP_CATEGORY}/${category}`, {
            method: "GET",
          headers: { "Content-Type": "application/json" },
          });
          const data = body
    return data
    }
        catch (error) {
            console.log("Error in getProductsByCategory:", error.message);
        }
}




const getRecommendedProducts =async()=>{
try{
    const { body } = await authFetch(import.meta.env.VITE_APP_recommended, {
        method: "GET",
      headers: { "Content-Type": "application/json" },
      });
      const data = body
      console.log(data)
}
catch(error){
    console.log("Error in getRecommendedProducts:", error.message);
}
}


const toggleFeaturedProduct =async(toggle)=>{
    try{
        const { body } = await authFetch(`${import.meta.env.VITE_APP_PRODUCTS}/${toggle}/toggle-featured`, {
            method: "PATCH",
          headers: { "Content-Type": "application/json" },
          });
          const data = body

          toggleFeaturedInStore(data._id, data.isFeatured);

          console.log(data)
    }
    catch(error){
        console.log("Error in toggleFeaturedProduct:", error.message);
    }
}


const getCoupon=async()=>{
    try{
    const { body } = await authFetch(import.meta.env.VITE_APP_GETCOUPON, {
        method: "GET",
      headers: { "Content-Type": "application/json" },
      });
      const data = body
      console.log(data)
}
catch(error){
    console.log("Error in getCoupon:", error.message);
}
}


const validateCoupon=async(code)=>{

    try{
    const { body } = await authFetch(import.meta.env.VITE_APP_VALIDATE, {
        method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code}),

      });
      const data = body
      console.log(data.totalAmount)
      setVoucherCode(data.totalAmount)
      console.log(voucherCode)

}
catch(error){
    console.log("Error in getCoupon:", error.message);
}
}

 



return{getAllProducts,getFeaturedProducts , createProduct , deleteProduct , getProductsByCategory ,
     getRecommendedProducts ,toggleFeaturedProduct ,getCoupon,validateCoupon}
}
export default useProductStore