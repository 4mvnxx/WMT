require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const connectDB = require("./config/db");

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL || "admin@wmt.com";
    const password = process.env.ADMIN_PASSWORD || "Admin@123";

    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`Admin already exists: ${existing.email}`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await User.create({
      name: "Admin",
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin user created successfully:", {
      id: admin._id,
      email: admin.email,
      role: admin.role,
      password,
    });
  } catch (error) {
    console.error("Seed admin failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();
