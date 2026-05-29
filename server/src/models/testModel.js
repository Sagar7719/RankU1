import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    totalTests: {
      type: Number,
      default: 0,
    },

    duration: {
      type: String,
      required: true,
    },

    verified: {
      type: Boolean,
      default: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    testType: {
      type: String,
      enum: ["Live", "Mock", "PYQ", "Sectional", "Topicwise"],
      default: "Mock",
    },

    isFree: {
      type: Boolean,
      default: true,
    },
    
    questionsPerAttempt: {
      type: Number,
      default: 0, // 0 means all questions
    },
  },
  {
    timestamps: true,
  }
);

const Test = mongoose.model("Test", testSchema);

export default Test;