



const useProductStore =()=>{


const getAllProducts=async()=>{
try{
    const response = await fetch(import.meta.env.VITE_APP_products, {
        method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      });
      const data= await response.json()
      console.log(data)


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
      console.log(data)

}
    catch (error) {
        console.log("Error in getFeaturedProducts:", error.message);
    }
} 

const createProduct=async(product)=>{
    try{
     const{ name, description, price, image, category}= product
      
     const response = await fetch(import.meta.env.VITE_APP_createProduct, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include', 
        body: JSON.stringify({ name, description, price, image, category}),
      });

      if (!response.ok) {
        throw new Error('Failed to sign up');
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

        const response = await fetch(`${import.meta.env.VITE_APP_createProduct}/${productId}`, {
            method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
          });
          const data= await response.json()
          console.log(data)
    
    }
        catch (error) {
            console.log("Error in deleteProduct:", error.message);
        }

}


const getProductsByCategory=async(category)=>{
    try{
console.log(category)
        const response = await fetch(`${import.meta.env.VITE_APP_category}/${category}`, {
            method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
          });
          const data= await response.json()
          console.log(data)
    
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
        const response = await fetch(`${import.meta.env.VITE_APP_category}/${toggle}/toggle-featured`, {
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

return{getAllProducts,getFeaturedProducts , createProduct , deleteProduct , getProductsByCategory , getRecommendedProducts ,toggleFeaturedProduct}
}
export default useProductStore