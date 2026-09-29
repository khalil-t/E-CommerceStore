import jwt from "jsonwebtoken";
import crypto from "crypto";


const ACCESS_TOKEN_TTL = "15m";

const REFRESH_TOKEN_TTL = "7d";

const PREVIOUS_TOKEN_GRACE_MS = 10 * 1000;

const ACCESS_COOKIE = "jwt";
const REFRESH_COOKIE = "refresh_token";

const ACCESS_TTL_SECONDS = 15 * 60;
const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60;

const baseCookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
};

const setCookie = (res, name, token, maxAgeMs) =>
    res.cookie(name, token, { ...baseCookieOptions, maxAge: maxAgeMs });

const newFamilyId = () => crypto.randomUUID();


const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const signAccessToken = (user) =>
    jwt.sign(
        { userId: user._id, tokenVersion: user.tokenVersion ?? 0, type: "access" },
        process.env.JWT_SECRET,
        { expiresIn: ACCESS_TTL_SECONDS }
    );

const signRefreshToken = (user, family) =>
    jwt.sign(
        {
            userId: user._id,
            tokenVersion: user.tokenVersion ?? 0,
            type: "refresh",
            family,
            jti: crypto.randomUUID(),
        },
        process.env.JWT_SECRET,
        { expiresIn: REFRESH_TTL_SECONDS }
    );

 
const signAuthPair = (user, family) => ({
    accessToken: signAccessToken(user),
    refreshToken: signRefreshToken(user, family),
});

const setAuthCookies = (res, { accessToken, refreshToken }) => {
    setCookie(res, ACCESS_COOKIE, accessToken, ACCESS_TTL_SECONDS * 1000);
    setCookie(res, REFRESH_COOKIE, refreshToken, REFRESH_TTL_SECONDS * 1000);
};


const clearAuthCookies = (res) => {
    res.clearCookie(ACCESS_COOKIE, { ...baseCookieOptions });
    res.clearCookie(REFRESH_COOKIE, { ...baseCookieOptions });
};

const verifyAuthToken = (token, expectedType) => {
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.type !== expectedType) return null;

        return decoded;
    } catch (error) {
        return null;
    }
};

const refreshTokenExpiry = () => new Date(Date.now() + REFRESH_TTL_SECONDS * 1000);

export {
    signAuthPair,
    setAuthCookies,
    clearAuthCookies,
    verifyAuthToken,
    signAccessToken,
    signRefreshToken,
    hashToken,
    newFamilyId,
    refreshTokenExpiry,
    ACCESS_COOKIE,
    REFRESH_COOKIE,
    PREVIOUS_TOKEN_GRACE_MS,
    REFRESH_TTL_SECONDS,
    ACCESS_TTL_SECONDS,
};
