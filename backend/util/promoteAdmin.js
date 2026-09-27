import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import User from "../model/user.model.js";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

const args = process.argv.slice(2);
const demote = args.includes("--demote");
const email = args.find((arg) => arg !== "--demote");

if (!email) {
  console.log("Usage: node backend/util/promoteAdmin.js <email> [--demote]");
  process.exit(1);
}

const role = demote ? "customer" : "admin";

try {
  await mongoose.connect(process.env.MONGODB_URI);

  const user = await User.findOneAndUpdate(
    { email: email.trim().toLowerCase() },
    { role },
    { new: true }
  );

  if (!user) {
    console.log(`No user found with email: ${email}`);
    console.log("Sign the account up first, then run this again.");
  } else {
    console.log(`${user.email} is now "${user.role}"`);
  }
} catch (error) {
  console.log("Error:", error.message);
} finally {
  await mongoose.disconnect();
}
