import User from "../model/user.model.js"
import { clearAuthCookies, verifyAuthToken, REFRESH_COOKIE } from "../util/generateToken.js"
import { startSession, rotateSession, revokeAllSessions, revokeSessionFamily } from "../lib/sessions.js"
import {
    isAdminBootstrapEnabled,
    ensureSingleAdminIndex,
    hasAdmin,
    createInitialAdmin,
} from "../lib/adminBootstrap.js"


const publicUser = (user) => ({
	_id: user._id,
    fullname: user.name,
    role: user.role,
});




const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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


export const adminRegister = async (req, res) => {
    try {
        
        if (!isAdminBootstrapEnabled()) {
            return res.status(503).json({ error: "Admin registration is not available on this server" });
        }

        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (typeof email !== "string" || !EMAIL_PATTERN.test(email.trim())) {
            return res.status(400).json({ error: "Enter a valid email address" });
        }

        
        
        if (typeof password !== "string" || password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        if (await hasAdmin()) {
            return res.status(409).json({ error: "An admin account already exists" });
        }

        if (await User.exists({ email })) {
            return res.status(409).json({ error: "Email already exists" });
        }

        
        await ensureSingleAdminIndex();

        let NewUser;
        try {
            NewUser = await createInitialAdmin({ name, email, password });
        } catch (error) {
            if (error.code === 11000) {
                
                if (await hasAdmin()) {
                    return res.status(409).json({ error: "An admin account already exists" });
                }
                return res.status(409).json({ error: "Email already exists" });
            }
            throw error;
        }

        
        
        await startSession(NewUser, res);

        res.status(201).json(publicUser(NewUser));
    } catch (error) {
        console.error("Admin registration error:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

export const login = async(req , res)=>{
try {
const {email , password} = req.body



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
