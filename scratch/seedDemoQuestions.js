import mongoose from "mongoose";
import Test from "../server/src/models/testModel.js";
import Question from "../server/src/models/questionModel.js";
import dotenv from "dotenv";

dotenv.config({ path: "../server/.env" });

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ranku1");
    console.log("Connected to DB");

    const test = await Test.create({
      title: "Dynamic Demo Test",
      description: "A demo test pulling 10 random questions from a pool of 20.",
      category: "SSC",
      duration: "15 Mins",
      difficulty: "Medium",
      testType: "Mock",
      isFree: true,
      questionsPerAttempt: 10
    });

    console.log("Created Test:", test.title);

    const questions = [];
    for (let i = 1; i <= 20; i++) {
      questions.push({
        testId: test._id,
        questionText: `This is dynamically loaded demo question number ${i}. Which of the following is correct?`,
        options: [
          `Option A for Q${i}`,
          `Option B for Q${i}`,
          `Option C for Q${i}`,
          `Option D for Q${i}`
        ],
        correctOptionIndex: Math.floor(Math.random() * 4),
        marks: 2,
        negativeMarks: 0.5,
        subject: i <= 10 ? "General Awareness" : "Quantitative Aptitude",
        explanation: `This is the explanation for question ${i}.`
      });
    }

    await Question.insertMany(questions);
    console.log("Inserted 20 Demo Questions into the pool.");

    mongoose.disconnect();
    console.log("Done seeding.");
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();
