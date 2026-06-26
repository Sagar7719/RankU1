import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import User from "./src/models/userModel.js";
import bcrypt from "bcryptjs";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = "admin@ranku1.com";
    const adminPassword = "adminPassword123!";

    // Check if admin already exists by email
    let existingUser = await User.findOne({ email: adminEmail });
    
    if (existingUser) {
      console.log("Admin user found! Updating...");
      existingUser.role = "admin";
      existingUser.isVerified = true;
      existingUser.password = adminPassword; // This will be hashed by pre-save hook
      await existingUser.save();
      console.log("Admin user updated successfully!");
      console.log("Email:", adminEmail);
      console.log("Password:", adminPassword);
      process.exit(0);
    }

    // Check if user with mobile number exists
    existingUser = await User.findOne({ mobileNumber: "7058293263" });
    if (existingUser) {
      console.log("User found with mobile number! Updating to admin...");
      existingUser.role = "admin";
      existingUser.isVerified = true;
      existingUser.email = adminEmail;
      existingUser.password = adminPassword; // This will be hashed by pre-save hook
      await existingUser.save();
      console.log("User updated to admin successfully!");
      console.log("Email:", adminEmail);
      console.log("Password:", adminPassword);
      process.exit(0);
    }

    // Create new admin user
    const adminUser = await User.create({
      name: "Super Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
      mobileNumber: "7058293263",
      isVerified: true
    });

    console.log("Admin user created successfully!");
    console.log("Email:", adminUser.email);
    console.log("Password: adminPassword123!");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

seedAdmin();
