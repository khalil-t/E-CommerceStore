import jwt from "jsonwebtoken";

// Short-lived access token. Every protected request is authorised with this one,
// so it is kept deliberately short.
const ACCESS_TOKEN_TTL = "15m";

// Longer-lived refresh token. Only /api/auth/refresh accepts it, and only to mint
// a new pair. Rotated on every refresh.
const REFRESH_TOKEN_TTL = "7d";

const ACCESS_COOKIE = "jwt";
const REFRESH_COOKIE = "refresh_token";

// "lax" rather than "strict": still blocks cross-site POST (so cookies are not
// attached to state-changing requests from another site), but permits the
// top-level navigation that a hosted payment page needs in order to return here.
const baseCookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
};

const signToken = (user, type, expiresIn) =>
    jwt.sign({ userId: user._id, tokenVersion: user.tokenVersion ?? 0, type }, process.env.JWT_SECRET, { expiresIn });

const setCookie = (res, name, token, ttl) =>
    res.cookie(name, token, { ...baseCookieOptions, maxAge: ttl });

const ACCESS_MAX_AGE = 15 * 60 * 1000;
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

// Issues both cookies. httpOnly means the browser never exposes these to JS, so
// they can never be read out of or written to localStorage.
const generateTokenAndSetCookie = (user, res) => {
    setCookie(res, ACCESS_COOKIE, signToken(user, "access", ACCESS_TOKEN_TTL), ACCESS_MAX_AGE);
    setCookie(res, REFRESH_COOKIE, signToken(user, "refresh", REFRESH_TOKEN_TTL), REFRESH_MAX_AGE);
};

// Re-issues a pair during a refresh. Rotating the refresh token on every use
// limits the value of a stolen one.
const refreshTokenAndSetCookie = (user, res) => generateTokenAndSetCookie(user, res);

// Must use the same options as when the cookie was set, otherwise the browser
// keeps the original and logout silently fails to clear the session.
const clearAuthCookies = (res) => {
    res.clearCookie(ACCESS_COOKIE, { ...baseCookieOptions });
    res.clearCookie(REFRESH_COOKIE, { ...baseCookieOptions });
};

const verifyAuthToken = (token, expectedType) => {
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // A refresh token must never be accepted as an access token, or a long
        // lived credential would bypass the short access lifetime.
        if (decoded.type !== expectedType) return null;

        return decoded;
    } catch (error) {
        return null;
    }
};

export {
    generateTokenAndSetCookie,
    refreshTokenAndSetCookie,
    clearAuthCookies,
    verifyAuthToken,
    ACCESS_COOKIE,
    REFRESH_COOKIE,
};
export default generateTokenAndSetCookie;
