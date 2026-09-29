

import { authFetch } from "../lib/authFetch";

const readErrorMessage = async (response, fallback) => {
  try {
    const body = await response.json();
    return body.error || body.message || fallback;
  } catch {
    return fallback;
  }
}

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
    throw new Error(await readErrorMessage(response, "Failed to log in"));
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
        throw new Error(await readErrorMessage(response, "Failed to sign up"));
    }
  
  const data= await response.json()
  return data;

}

const AdminRegister = async (form) => {
  const { name, email, password, confirmPassword } = form;
  const response = await fetch(import.meta.env.VITE_APP_ADMIN_REGISTER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Failed to register the admin"));
  }

  return await response.json();
}

const Logout = async()=>{
try {
  const { body } = await authFetch(import.meta.env.VITE_APP_LOGOUT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return body;
}
catch (error) {
    console.log("Error in logout:", error.message);
}
}

const getUser=async()=>{
 try{
  const { response, body } = await authFetch(import.meta.env.VITE_APP_ME_URL, {
    method: "GET",
  headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    return null;
  }

return body
}
catch (error) {
    console.log("Error in getUser:", error.message);
    return null;
}
}


return {Login,Signup, AdminRegister, getUser , Logout}
}
export default useUserStore

