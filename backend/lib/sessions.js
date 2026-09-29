import RefreshToken from "../model/refreshToken.model.js";
import {
    signAuthPair,
    setAuthCookies,
    hashToken,
    newFamilyId,
    refreshTokenExpiry,
    REFRESH_TTL_SECONDS,
    PREVIOUS_TOKEN_GRACE_MS,
} from "../util/generateToken.js";

// A few devices per account, not unlimited ones: the oldest sessions are dropped.
const MAX_SESSIONS_PER_USER = 5;

// Parallel refreshes each move the live token, so one pass is not always enough to tell a
// duplicate from a stolen token.
const MAX_ROTATION_ATTEMPTS = 3;

export const startSession = async (user, res) => {
    const family = newFamilyId();

    // Record before sending: pair.refreshToken is the exact value the browser will hold, so its
    // digest is what gets stored.
    const pair = signAuthPair(user, family);

    await RefreshToken.create({
        user: user._id,
        family,
        tokenHash: hashToken(pair.refreshToken),
        expiresAt: refreshTokenExpiry(),
    });

    setAuthCookies(res, pair);

    await enforceSessionLimit(user._id);

    return family;
};

// Exchanges a valid refresh token for a fresh pair, consuming the presented one so a copy taken
// from the browser stops working. Every decision is a single conditional update, which MongoDB
// applies atomically: with a read-then-save, two parallel refreshes would both read the same
// row and the second save would orphan the first token.
export const rotateSession = async (user, res, family, presentedToken) => {
    const presentedHash = hashToken(presentedToken);

    // A burst of parallel requests can outrun a single pass, so re-read before calling a token
    // a replay.
    for (let attempt = 0; attempt < MAX_ROTATION_ATTEMPTS; attempt++) {
        const record = await RefreshToken.findOne({ user: user._id, family });

        if (!record || record.revoked) break;

        const isLive = record.tokenHash === presentedHash;
        const inGrace =
            record.previousTokenHash === presentedHash &&
            record.previousValidUntil &&
            record.previousValidUntil > new Date();

        if (isLive || inGrace) {
            // A live token is consumed; one inside the grace window has already lost a race, so
            // the record's current token is demoted instead. Either way a token another
            // response already sent stays usable.
            const expectedHash = isLive ? presentedHash : record.tokenHash;
            const demotedHash = expectedHash;

            const pair = signAuthPair(user, family);

            const updated = await RefreshToken.findOneAndUpdate(
                { _id: record._id, tokenHash: expectedHash, revoked: { $ne: true } },
                {
                    $set: {
                        tokenHash: hashToken(pair.refreshToken),
                        previousTokenHash: demotedHash,
                        previousValidUntil: new Date(Date.now() + PREVIOUS_TOKEN_GRACE_MS),
                        lastUsedAt: new Date(),
                    },
                },
                { new: true }
            );

            // Lost the race; re-read and decide again.
            if (!updated) continue;

            // Only now that it is durably recorded does the token reach the client.
            setAuthCookies(res, pair);

            return { ok: true };
        }

        // Neither live nor in the grace window. Re-read once before calling it stolen, since
        // the row may simply have moved.
        const recheck = await RefreshToken.findById(record._id);
        if (!recheck || recheck.revoked) break;
        if (
            recheck.tokenHash === presentedHash ||
            (recheck.previousTokenHash === presentedHash && recheck.previousValidUntil > new Date())
        ) {
            continue;
        }

        break;
    }

    // Burn the family, so a stolen copy and the real session are both dead.
    await revokeSessionFamily(family);

    return { ok: false, reason: "reuse" };
};

export const revokeSessionFamily = async (family) => {
    if (!family) return;
    await RefreshToken.deleteMany({ family });
};

export const revokeAllSessions = async (userId) => {
    if (!userId) return;
    await RefreshToken.deleteMany({ user: userId });
};

const enforceSessionLimit = async (userId) => {
    const sessions = await RefreshToken.find({ user: userId })
        .sort({ createdAt: -1 })
        .select("_id");

    const excess = sessions.slice(MAX_SESSIONS_PER_USER);
    if (excess.length > 0) {
        await RefreshToken.deleteMany({ _id: { $in: excess.map((s) => s._id) } });
    }
};

export { MAX_SESSIONS_PER_USER, REFRESH_TTL_SECONDS };
