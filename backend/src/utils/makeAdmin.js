// One-time utility: promotes an existing user to admin by email.
// Run with: node src/utils/makeAdmin.js someone@example.com
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const email = process.argv[2];

if (!email) {
  console.error("Usage: node src/utils/makeAdmin.js <email>");
  process.exit(1);
}

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase().trim() },
    { isAdmin: true },
    { new: true }
  );

  if (!user) {
    console.error(`No user found with email: ${email}`);
  } else {
    console.log(`${user.email} is now an admin.`);
  }

  await mongoose.disconnect();
  process.exit(user ? 0 : 1);
};

run().catch((err) => {
  console.error("Failed to promote user:", err);
  process.exit(1);
});
