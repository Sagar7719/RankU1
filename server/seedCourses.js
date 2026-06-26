import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "./src/models/courseModel.js";

dotenv.config();

const seedCourses = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ranku1";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding courses...");

    // Clear existing courses to start fresh
    await Course.deleteMany({});
    console.log("Cleared existing courses.");

    const coursesToSeed = [
      {
        title: "IB PAID",
        subtitle: "IB PAID",
        exam: "IB",
        type: "Paid",
        price: 1999,
        isFree: false,
        badgeText: "PAID",
        tagText: "IB",
        students: "1.2k+",
        rating: "4.9",
        duration: "12 MONTH",
        gradient: "linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%)"
      },
      {
        title: "IB INTERVIEW",
        subtitle: "IB INTERVIEW",
        exam: "IB ACIO",
        type: "Free",
        price: 0,
        isFree: true,
        badgeText: "FREE",
        tagText: "IB ACIO",
        students: "1.2k+",
        rating: "4.9",
        duration: "6 MONTHS",
        gradient: "linear-gradient(135deg, #065f46 0%, #022c22 100%)"
      }
    ];

    const seeded = await Course.insertMany(coursesToSeed);
    console.log(`Successfully seeded ${seeded.length} courses!`);

    await mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding courses:", error);
    process.exit(1);
  }
};

seedCourses();
