

import { authFetch } from "../lib/authFetch";

// Reads the error message from a failed response without throwing. Express
// replies with an HTML page (not JSON) for some failures, and a bare
// response.json() there rejects with a SyntaxError that hides the real status.
const readErrorMessage = async (response, fallback) => {
  try {
    const body = await response.json();
    return body.error || body.message || fallback;
  } catch {
    return fallback;
  }
}

const useUserStore=()=>{

// Accepts { email, password }. This is the contract the backend expects, so the
// field names here must stay lowercase and match LoginPage and SignUpPage.
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

  // Trusted server response only. Never the submitted credentials: the password
  // must not reach Zustand persistence or localStorage.
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

// Restores the session on page load. Goes through authFetch so a page refresh
// still succeeds when the short-lived access token has expired but the refresh
// token is still valid.
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


return {Login,Signup, getUser , Logout}
}
export default useUserStore

