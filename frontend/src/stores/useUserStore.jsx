import User from "../../../backend/model/user.model";



const useUserStore=()=>{

const Login=async(Login)=>{

    try{
const {Email , Password}=Login
const response = await fetch(import.meta.env.VITE_APP_LOGIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: 'include', 
    body: JSON.stringify({ Email , Password }),
  });

  if (!response.ok) {
    throw new Error('Failed to sign up');
  }

  const data= await response.json()
  console.log(data)
  

}
    catch (error) {
        console.log("Error in login:", error.message);
      }
    
    
    
    }


const Signup=async(Signup)=>{
try{
  const {	name,
		email,
		password,
		confirmPassword}=Signup
  const response = await fetch(import.meta.env.VITE_APP_SIGNUP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include', 
      body: JSON.stringify({ name,
        email,
        password,
        confirmPassword}),
    });
  
    if (!response.ok) {
      throw new Error('Failed to sign up');
    }
  
    const data= await response.json()


}
catch (error) {
  console.log("Error in Signup:", error.message);
}

}

const Logout = async()=>{
try {
  const response = await fetch(import.meta.env.VITE_APP_LOGOUT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  credentials: 'include',
  });
  const data= await response.json()
  console.log(data)
}
catch (error) {
  console.log("Error in logout:", error.message);
}
}


const getUser=async()=>{
try{
  const response = await fetch(import.meta.env.VITE_APP_GETALLUSERS_URL, {
    method: "GET",
  headers: { "Content-Type": "application/json" },
  credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to sign up');
  }

  const data= await response.json()
return data
}
catch (error) {
  console.log("Error :", error.message);
}
}


return {Login,Signup, getUser , Logout}
}
export default useUserStore