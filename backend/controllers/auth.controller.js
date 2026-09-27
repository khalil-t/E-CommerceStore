import User from "../model/user.model.js"
import generateTokenAndSetCookie from "../util/generateToken.js"

export const signup = async(req , res)=>{

    try{
        const {name ,email , password , confirmPassword,role} = req.body
if (password != confirmPassword){
    return res.status(400).json({error :'Passwords do not match' })
}
const find = await User.findOne({email})

if(find){
   return res.status(409).json({error : "Username already exists"})
}
const NewUser = new User({ name, email, password })
await NewUser.save()
const token =generateTokenAndSetCookie(NewUser._id.toString(),res)
res.status(200).json({
	_id: NewUser._id,
    fullname: NewUser.name,
    role: NewUser.role,
				
})
    }
    catch(error){
        console.error('Signup error:', error);
    
        res.status(500).json({ error: "Error" }) }
}

export const login = async(req , res)=>{

try {
const {email , password} = req.body

if(!email || !password){
    return res.status(400).json({error: "Email and password are required" })
}

const newuser = await User.findOne({ email: email.trim().toLowerCase() })

if(!newuser || !(await newuser.comparePassword(password))){
    return res.status(401).json({error: "Invalid email or password" })
}

generateTokenAndSetCookie(newuser._id, res )

res.status(200).json({
    _id: newuser._id,
    fullname: newuser.name,
    role: newuser.role,
		
})



}
catch(error){
    console.log("Error in login controller", error.message);
    res.status(500).json({error: "error"}) 
}



}

export const logout = async(req , res)=>{
try {
    res.clearCookie("jwt"); 
    res.status(200).json({ message: "Logged out successfully" });

}
catch(error){
    console.log("Error in logout controller", error.message);
    res.status(500).json({error: "error"})

}

}


export const getUserProfile=async(req,res)=>{
        try {
            res.status(200).json(req.user)
        }
        catch(error){
            console.log("Error getUserProfile", error.message);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
        
        }

}

export const getAllUsers=async(req,res)=>{
        try {
const users = await User.find().select("-password")

            res.status(200).json(users)
        }
        catch(error){
            console.log("Error getAllUsers", error.message);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
        
        }

}
