import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';

const protectRoute = async (req, res, next) => {
    try {

        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" });
        }

        const finduser = await User.findOne({ _id: decoded.userId }).select("-password");

        if (!finduser) {
            console.log("User not found with ID:", decoded.userId);
            return res.status(401).json({ error: "Unauthorized - User Not Found" });
        }

        req.user = finduser;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default protectRoute;
