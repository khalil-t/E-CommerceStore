const UseUserStore=()=>{

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
        console.log("Error in Signup:", error.message);
      }}



const Signup=async(Signup)=>{
  try{
    const {name , email, password,confirmPassword}=Signup
    const response = await fetch(import.meta.env.VITE_APP_SIGNUP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include', 
        body: JSON.stringify({name , email, password,confirmPassword}),
      });

      const data= await response.json()
      if (!response.ok) {

        throw new Error('Failed to sign up');
      }
      console.log(data)
  }
  catch (error) {
    console.log("Error in Signup:", error.message);
  }
  }
  return {Login , Signup}

}


export default UseUserStore



