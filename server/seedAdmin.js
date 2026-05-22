import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import User from "./src/models/userModel.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();
    
    const adminEmail = "admin@ranku1.com";
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin user already exists! Updating missing fields...");
      if (!existingAdmin.mobileNumber) {
        existingAdmin.mobileNumber = "1234567890";
        await existingAdmin.save();
        console.log("Admin mobile number '1234567890' added successfully!");
      }
      process.exit(0);
    }
    
    const adminUser = await User.create({
      name: "Super Admin",
      email: adminEmail,
      password: "adminPassword123!",
      role: "admin",
      mobileNumber: "1234567890"
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
