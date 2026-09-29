let refreshInFlight = null;

const parseBody = async (response) => {
    try {
        return await response.json();
    } catch {
        return null;
    }
};

const clearSession = () => {
    try {
        localStorage.removeItem("user-storage");
    } catch {
    }
};

const renewSession = () => {
    if (!refreshInFlight) {
        refreshInFlight = (async () => {
            try {
                const refreshed = await fetch(import.meta.env.VITE_APP_REFRESH_URL, {
                    method: "POST",
                    credentials: "include",
                });

                if (!refreshed.ok) {
                    clearSession();
                    return false;
                }

                return true;
            } catch {
                clearSession();
                return false;
            } finally {
                refreshInFlight = null;
            }
        })();
    }

    return refreshInFlight;
};

export const authFetch = async (url, options = {}, attempt = 0) => {
    const response = await fetch(url, { ...options, credentials: options.credentials || "include" });

    if (response.status !== 401 || options.skipRefresh || attempt > 0) {
        return { response, body: await parseBody(response) };
    }

    const renewed = await renewSession();

    if (!renewed) {
        return { response, body: await parseBody(response) };
    }

    return authFetch(url, options, attempt + 1);
};

export const authErrorMessage = (body, fallback) => body?.error || body?.message || fallback;

export default authFetch;
