const UseLogin=()=>{

const Login=async(Login)=>{

    try{
const {Email , Password}=Login
const response = await fetch("", {
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

return {Login}
}
export default UseLogin