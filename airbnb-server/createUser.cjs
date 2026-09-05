const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const createUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully!");

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const existingUser = await User.findOne({
      email: "admin@airbnbclone.com",
    });

    if (existingUser) {
      console.log("Admin user already exists.");
      process.exit(0);
    }

    const user = await User.create({
      username: "Admin",
      email: "admin@airbnbclone.com",
      password: hashedPassword,
      role: "host",
    });

    console.log("Admin user created successfully!");
    console.log("Email: admin@airbnbclone.com");
    console.log("Password: admin123");
    console.log("User ID:", user._id);

    process.exit(0);
  } catch (error) {
    console.error("Error creating user:", error.message);
    process.exit(1);
  }
};

createUser();