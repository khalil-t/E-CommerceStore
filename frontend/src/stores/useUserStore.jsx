

const useUserStore=()=>{

const Login=async(credentials)=>{

const {email , password}=credentials
const response = await fetch(import.meta.env.VITE_APP_LOGIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: 'include', 
    body: JSON.stringify({ email , password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to log in");
  }

  const data= await response.json()
  return data;
}

const Signup=async(Signup)=>{
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
        const error = await response.json();
        throw new Error(error.error || "Failed to sign up");
    }
  
  const data= await response.json()
  return data;

}

const Logout = async()=>{
try {
  const response = await fetch(import.meta.env.VITE_APP_LOGOUT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  credentials: 'include',
  });
  await response.json()
}
catch (error) {
    console.log("Error in logout:", error.message);
}
}

const getUser=async()=>{
try{
  const response = await fetch(import.meta.env.VITE_APP_ME_URL, {
    method: "GET",
  headers: { "Content-Type": "application/json" },
  credentials: 'include',
  });

  if (!response.ok) {
    return null;
  }

  const data= await response.json()
return data
}
catch (error) {
    console.log("Error in getUser:", error.message);
    return null;
}
}


return {Login,Signup, getUser , Logout}
}
export default useUserStore
