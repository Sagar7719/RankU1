import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import User from "./src/models/userModel.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = "admin@ranku1.com"; // Change this if you want a different email


    // Check if user with that mobile number already exists
    const existingUser = await User.findOne({ mobileNumber: "7058293263" });
    if (existingUser) {
      console.log("User found! Updating role to admin...");
      existingUser.role = "admin"; // Ensure they are admin
      await existingUser.save();
      console.log("User role updated successfully to admin!");
      process.exit(0);
    }

    const adminUser = await User.create({
      name: "Super Admin",
      email: adminEmail,
      password: "adminPassword123!",
      role: "admin",
      mobileNumber: "7058293263" // <-- Add the new mobile number here
    });

    console.log("Admin user created successfully!");
    console.log("Email: " + adminUser.email);
    console.log("Password: adminPassword123!");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

seedAdmin();
