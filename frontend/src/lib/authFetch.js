// Auth-aware fetch for requests that require a session.
//
// The access token is a short-lived cookie, so it can expire while the user is
// browsing. On a 401 this calls /api/auth/refresh once and replays the original
// request. If that also fails the session is genuinely gone, the cookies are
// cleared and the caller sees the 401.
//
// Pass { skipRefresh: true } for the refresh call itself, to avoid recursing.

const parseBody = async (response) => {
    try {
        return await response.json();
    } catch {
        // The server did not send JSON (a proxy or gateway error page, for
        // example). Never let a parse failure mask the real status.
        return null;
    }
};

const clearSession = () => {
    try {
        localStorage.removeItem("user-storage");
    } catch {
        // Private mode or storage disabled; nothing to clear.
    }
};

export const authFetch = async (url, options = {}, attempt = 0) => {
    const response = await fetch(url, { ...options, credentials: "include" });

    if (response.status !== 401 || options.skipRefresh || attempt > 0) {
        return { response, body: await parseBody(response) };
    }

    // The access token may simply have expired. Try to renew the session once.
    const refreshed = await fetch(import.meta.env.VITE_APP_REFRESH_URL, {
        method: "POST",
        credentials: "include",
    });

    if (!refreshed.ok) {
        clearSession();
        return { response, body: await parseBody(response) };
    }

    return authFetch(url, options, attempt + 1);
};

export const authErrorMessage = (body, fallback) => body?.error || body?.message || fallback;

export default authFetch;
