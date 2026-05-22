import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
      validate: [v => v.length >= 2, "A question must have at least 2 options"]
    },
    correctOptionIndex: {
      type: Number,
      required: true,
      min: 0
    },
    marks: {
      type: Number,
      default: 1,
    },
    negativeMarks: {
      type: Number,
      default: 0,
    },
    explanation: {
      type: String,
    },
    subject: {
      type: String,
      required: true,
      default: "General Awareness",
    }
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
