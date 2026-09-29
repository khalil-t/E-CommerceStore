import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        // Every token minted from one login shares a family; rotation replaces the token inside
        // it, and presenting an already-rotated token means a copy exists, so the family is
        // destroyed.
        family: {
            type: String,
            required: true,
            index: true,
        },
        // SHA-256 of the token currently valid. The raw token lives only in the httpOnly
        // cookie, so a database leak cannot be replayed.
        tokenHash: {
            type: String,
            required: true,
            unique: true,
        },
        // A refresh can legitimately arrive twice at once (two tabs, a double click), so the
        // previous token stays usable briefly; anything older is treated as theft.
        previousTokenHash: {
            type: String,
            default: null,
        },
        previousValidUntil: {
            type: Date,
            default: null,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshToken;
