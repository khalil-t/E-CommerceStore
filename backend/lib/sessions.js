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


const MAX_SESSIONS_PER_USER = 5;



const MAX_ROTATION_ATTEMPTS = 3;

export const startSession = async (user, res) => {
    const family = newFamilyId();

    
    
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





export const rotateSession = async (user, res, family, presentedToken) => {
    const presentedHash = hashToken(presentedToken);

    
    
    for (let attempt = 0; attempt < MAX_ROTATION_ATTEMPTS; attempt++) {
        const record = await RefreshToken.findOne({ user: user._id, family });

        if (!record || record.revoked) break;

        const isLive = record.tokenHash === presentedHash;
        const inGrace =
            record.previousTokenHash === presentedHash &&
            record.previousValidUntil &&
            record.previousValidUntil > new Date();

        if (isLive || inGrace) {
            
            
            
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

            
            if (!updated) continue;

            
            setAuthCookies(res, pair);

            return { ok: true };
        }

        
        
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
