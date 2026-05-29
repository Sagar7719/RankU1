import mongoose from "mongoose";
import dotenv from "dotenv";
import Exam from "./src/models/examModel.js";

dotenv.config();

const seedExams = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ranku1";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding exams...");

    // Delete existing exams to avoid duplication or start fresh
    await Exam.deleteMany({});
    console.log("Cleared existing exams.");

    const examsToSeed = [
      {
        name: "SSC CHSL 2024",
        category: "SSC",
        eligibility: "12th Pass (10+2) from recognized board.",
        pattern: "Tier 1 (Objective) + Tier 2 (Objective + Skill Test).",
        vacancies: "4,500+ (Tentative).",
        overview: "SSC CHSL (Combined Higher Secondary Level) exam is conducted to recruit for posts like Lower Division Clerk (LDC), Junior Secretariat Assistant (JSA), and Data Entry Operator (DEO).",
        syllabusLink: "#"
      },
      {
        name: "SSC CGL 2024",
        category: "SSC",
        eligibility: "Bachelor's Degree in any discipline from a recognized university.",
        pattern: "Tier 1 (Objective) + Tier 2 (Objective).",
        vacancies: "17,727 (Tentative).",
        overview: "SSC CGL (Combined Graduate Level) exam is conducted to recruit group B and C officers for various ministries, departments, and organizations of the Government of India.",
        syllabusLink: "#"
      },
      {
        name: "SSC CGL 2026",
        category: "SSC",
        eligibility: "Bachelor's Degree from a recognized university.",
        pattern: "Tier 1 + Tier 2.",
        vacancies: "TBD",
        overview: "SSC CGL exam for the upcoming recruitment cycle.",
        syllabusLink: "#"
      }
    ];

    const seeded = await Exam.insertMany(examsToSeed);
    console.log(`Successfully seeded ${seeded.length} exams!`);

    await mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding exams:", error);
    process.exit(1);
  }
};

seedExams();
