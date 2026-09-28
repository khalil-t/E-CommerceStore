import User from "../model/user.model.js"
import { refreshTokenAndSetCookie, clearAuthCookies, verifyAuthToken, REFRESH_COOKIE } from "../util/generateToken.js"


const publicUser = (user) => ({
	_id: user._id,
    fullname: user.name,
    role: user.role,
});

export const signup = async(req , res)=>{

    try{
  
        const {name ,email , password , confirmPassword} = req.body
if (!name || !email || !password || !confirmPassword){
    return res.status(400).json({error :'All fields are required' })
}
if (password != confirmPassword){
    return res.status(400).json({error :'Passwords do not match' })
}
const find = await User.findOne({email})

if(find){
   return res.status(409).json({error : "Username already exists"})
}
const NewUser = new User({ name, email, password, role: "customer" })
await NewUser.save()
refreshTokenAndSetCookie(NewUser, res)
res.status(200).json(publicUser(NewUser))
    }
    catch(error){
        console.error('Signup error:', error);
    
        res.status(500).json({ error: "Error" }) }
}

export const login = async(req , res)=>{

try {
const {email , password} = req.body

// Type-check before use. email.trim() on a non-string (number, object, array)
// would throw a TypeError and surface as an unexplained 500.
if(typeof email !== "string" || typeof password !== "string" || !email || !password){
    return res.status(400).json({error: "Email and password are required" })
}

const newuser = await User.findOne({ email: email.trim().toLowerCase() })

if(!newuser || !(await newuser.comparePassword(password))){
    return res.status(401).json({error: "Invalid email or password" })
}

refreshTokenAndSetCookie(newuser, res )

res.status(200).json(publicUser(newuser))



}
catch(error){
    console.log("Error in login controller", error.message);
    res.status(500).json({error: "error"}) 
}



}

export const logout = async(req , res)=>{
try {
    // Clearing the cookie only removes the browser's copy. Any token that was
    // already captured stays cryptographically valid until it expires, so bump
    // tokenVersion as well: every token issued before this point now fails the
    // check in protectRoute.
    const decoded = verifyAuthToken(req.cookies[REFRESH_COOKIE], "refresh")
        || verifyAuthToken(req.cookies.jwt, "access");

    if (decoded) {
        await User.updateOne(
            { _id: decoded.userId },
            { $inc: { tokenVersion: 1 } }
        );
    }

    clearAuthCookies(res);
    res.status(200).json({ message: "Logged out successfully" });

}
catch(error){
    console.log("Error in logout controller", error.message);
    res.status(500).json({error: "error"})

}

}

// Exchanges a valid refresh token for a fresh cookie pair. The access token is
// short-lived, so the frontend calls this transparently when it hits a 401.
export const refresh = async(req , res)=>{
try {
    const decoded = verifyAuthToken(req.cookies[REFRESH_COOKIE], "refresh");

    if (!decoded) {
        return res.status(401).json({ error: "Unauthorized - Invalid or Expired Refresh Token" });
    }

    const user = await User.findOne({ _id: decoded.userId }).select("-password");

    if (!user) {
        return res.status(401).json({ error: "Unauthorized - User Not Found" });
    }

    // A logout or a revoked session invalidates the refresh token too.
    if ((decoded.tokenVersion ?? 0) !== (user.tokenVersion ?? 0)) {
        clearAuthCookies(res);
        return res.status(401).json({ error: "Unauthorized - Session Revoked" });
    }

    refreshTokenAndSetCookie(user, res);
    res.status(200).json(publicUser(user));
}
catch(error){
    console.log("Error in refresh controller", error.message);
    res.status(500).json({error: "error"})
}

}


export const getUserProfile=async(req,res)=>{
        try {
       
            res.status(200).json(publicUser(req.user))
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
