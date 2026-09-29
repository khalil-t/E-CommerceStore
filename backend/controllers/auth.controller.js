import User from "../model/user.model.js"
import { clearAuthCookies, verifyAuthToken, REFRESH_COOKIE } from "../util/generateToken.js"
import { startSession, rotateSession, revokeAllSessions, revokeSessionFamily } from "../lib/sessions.js"


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
await startSession(NewUser, res)
res.status(200).json(publicUser(NewUser))
    }
    catch(error){
        console.error('Signup error:', error);
    
        res.status(500).json({ error: "Error" }) }
}

export const login = async(req , res)=>{

try {
const {email , password} = req.body

// Type-check before use: email.trim() on a non-string would throw and surface as an unexplained
// 500.
if(typeof email !== "string" || typeof password !== "string" || !email || !password){
    return res.status(400).json({error: "Email and password are required" })
}

const newuser = await User.findOne({ email: email.trim().toLowerCase() })

if(!newuser || !(await newuser.comparePassword(password))){
    return res.status(401).json({error: "Invalid email or password" })
}

await startSession(newuser, res )

res.status(200).json(publicUser(newuser))



}
catch(error){
    console.log("Error in login controller", error.message);
    res.status(500).json({error: "error"}) 
}



}

export const logout = async(req , res)=>{
try {
    // Clearing the cookie only removes the browser's copy, and a token already captured stays
    // valid until it expires, so bump tokenVersion as well to invalidate every token issued
    // before this point.
    const decoded = verifyAuthToken(req.cookies[REFRESH_COOKIE], "refresh")
        || verifyAuthToken(req.cookies.jwt, "access");

    if (decoded) {
        await User.updateOne(
            { _id: decoded.userId },
            { $inc: { tokenVersion: 1 } }
        );
        await revokeAllSessions(decoded.userId);
    }

    clearAuthCookies(res);
    res.status(200).json({ message: "Logged out successfully" });

}
catch(error){
    console.log("Error in logout controller", error.message);
    res.status(500).json({error: "error"})

}

}

// Exchanges a valid refresh token for a fresh cookie pair, called by the frontend when a
// request hits a 401.
export const refresh = async(req , res)=>{
try {
    const presentedToken = req.cookies[REFRESH_COOKIE];
    const decoded = verifyAuthToken(presentedToken, "refresh");

    if (!decoded) {
        return res.status(401).json({ error: "Unauthorized - Invalid or Expired Refresh Token" });
    }

    const user = await User.findOne({ _id: decoded.userId }).select("-password");

    if (!user) {
        return res.status(401).json({ error: "Unauthorized - User Not Found" });
    }

    if ((decoded.tokenVersion ?? 0) !== (user.tokenVersion ?? 0)) {
        await revokeAllSessions(user._id);
        clearAuthCookies(res);
        return res.status(401).json({ error: "Unauthorized - Session Revoked" });
    }

    const result = await rotateSession(user, res, decoded.family, presentedToken);

    if (!result.ok) {
        // The token was already used, so this is a replay of a copy that should not exist. Burn
        // the family: attacker and real user are both signed out.
        await revokeSessionFamily(decoded.family);
        clearAuthCookies(res);
        return res.status(401).json({ error: "Unauthorized - Refresh Token Reuse Detected" });
    }

    res.status(200).json(publicUser(user));
}
catch(error){
    console.log("Error in refresh controller", error.message);
    clearAuthCookies(res);
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
