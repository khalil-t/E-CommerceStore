import User from "../model/user.model.js";
import { verifyAuthToken, ACCESS_COOKIE } from "../util/generateToken.js";
import asyncHandler from "./asyncHandler.js";

const protectRoute = async (req, res, next) => {
    try {
        const decoded = verifyAuthToken(req.cookies[ACCESS_COOKIE], "access");

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid or Expired Token" });
        }

        const finduser = await User.findOne({ _id: decoded.userId }).select("-password");

        if (!finduser) {
            return res.status(401).json({ error: "Unauthorized - User Not Found" });
        }

        // The role always comes from this document, never from the token or the request, so it
        // cannot be forged and reflects role changes immediately.
        if ((decoded.tokenVersion ?? 0) !== (finduser.tokenVersion ?? 0)) {
            return res.status(401).json({ error: "Unauthorized - Session Revoked" });
        }

        req.user = finduser;
        next();
    } catch (error) {
        console.error("Error in protectRoute middleware:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Expected auth failures are answered with 401 above; only an unexpected failure, such as the
// database being unreachable, reaches the catch and produces a 500.
export default asyncHandler(protectRoute);
