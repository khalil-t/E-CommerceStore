

import useUser from "../lib/Zustand"

const useProductStore =()=>{
    const productList = useUser((state) => state.productList);
	const addProduct = useUser((state) => state.addProduct);
	const setProductList = useUser((state) => state.setProductList);
	const UpdateProduct = useUser((state) => state.UpdateProduct);
    const toggleFeaturedInStore = useUser((state) => state.toggleFeaturedInStore);

const getAllProducts=async()=>{
try{
    const response = await fetch(import.meta.env.VITE_APP_PRODUCTS, {
        method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      });
      const data= await response.json()
      setProductList(data.products);
      return data;


}
catch (error) {
    console.log("Error in getAllProducts:", error.message);
  
}
}

const getFeaturedProducts=async()=>{
try{

    const response = await fetch(import.meta.env.VITE_APP_products, {
        method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      });
      const data= await response.json()

}
    catch (error) {
        console.log("Error in getFeaturedProducts:", error.message);
    }
} 

const createProduct=async(product)=>{
    try{
     const{ name, description, price, image, category}= product
      
     const response = await fetch(import.meta.env.VITE_APP_CREATEPRODUCT , {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include', 
        body: JSON.stringify({ name, description, price, image, category}),
      });

      if (!response.ok) {
        throw new Error('Failed to createProduct');
      }
    
      const data= await response.json()
      console.log(data)
  
    }
        catch (error) {
            console.log("Error in createProduct:", error.message);
        }
}


const deleteProduct=async(productId)=>{
    try{

        const response = await fetch(`${import.meta.env.VITE_APP_CREATEPRODUCT}/${productId}`, {
            method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
          });
          const data= await response.json()
          UpdateProduct(data)
          console.log(data)
    
    }
        catch (error) {
            console.log("Error in deleteProduct:", error.message);
        }

}


const getProductsByCategory=async(category)=>{
    try{
        const response = await fetch(`${import.meta.env.VITE_APP_CATEGORY}/${category}`, {
            method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
          });
          const data= await response.json()
    return data
    }
        catch (error) {
            console.log("Error in getProductsByCategory:", error.message);
        }
}


const getRecommendedProducts =async()=>{
try{
    const response = await fetch(import.meta.env.VITE_APP_recommended, {
        method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      });
      const data= await response.json()
      console.log(data)
}
catch(error){
    console.log("Error in getRecommendedProducts:", error.message);
}
}


const toggleFeaturedProduct =async(toggle)=>{
    try{
        const response = await fetch(`${import.meta.env.VITE_APP_PRODUCTS}/${toggle}/toggle-featured`, {
            method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
          });
          const data= await response.json()

          toggleFeaturedInStore(data._id, data.isFeatured);

          console.log(data)
    }
    catch(error){
        console.log("Error in toggleFeaturedProduct:", error.message);
    }
}

return{getAllProducts,getFeaturedProducts , createProduct , deleteProduct , getProductsByCategory , getRecommendedProducts ,toggleFeaturedProduct}
}
export default useProductStore