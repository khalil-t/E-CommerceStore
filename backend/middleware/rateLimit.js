// In-memory fixed-window limiter, per IP. For more than one instance the counters must move to
// Redis (ioredis is already a dependency) or the limit becomes per-instance.
const createRateLimiter = ({ windowMs, max, message }) => {
    const hits = new Map();

    // Stops the map growing without bound as addresses come and go.
    const sweep = setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of hits) {
            if (entry.resetAt <= now) hits.delete(key);
        }
    }, windowMs);

    sweep.unref();

    return (req, res, next) => {
        const now = Date.now();
        const key = req.ip || "unknown";
        const entry = hits.get(key);

        if (!entry || entry.resetAt <= now) {
            hits.set(key, { count: 1, resetAt: now + windowMs });
            return next();
        }

        entry.count += 1;

        if (entry.count > max) {
            const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
            res.set("Retry-After", String(retryAfter));
            return res.status(429).json({ error: message, retryAfter });
        }

        next();
    };
};

export const loginLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many login attempts. Please try again later.",
});

export const signupLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: "Too many accounts created from this address. Please try again later.",
});

export const refreshLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
    message: "Too many refresh attempts. Please try again later.",
});

export default createRateLimiter;
