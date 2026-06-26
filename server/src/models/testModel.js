import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    exam: {
      type: String,
      required: true,
      trim: true,
    },
    testTitle: {
      type: String,
      required: true,
      trim: true,
    },
    examCategory: {
      type: String,
      required: true,
      trim: true,
    },
    seriesTitle: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      default: "",
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    questionsLimit: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
      required: true,
    },
    marks: {
      type: String,
      required: true,
    },
    questionType: {
      type: String,
      required: true,
      trim: true,
    },
    teststatus: {
      type: String,
      enum: ["free", "locked", "scheduled", "availablesoon"],
      required: true,
      default: "free",
    }
  },
  {
    timestamps: true,
  }
);

const Test = mongoose.model("Test", testSchema);

export default Test;