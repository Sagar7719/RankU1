import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  selectedOptionIndex: {
    type: Number,
    required: false,
  },
  isCorrect: {
    type: Boolean,
    required: false,
  }
});

const subjectBreakdownSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  totalQuestions: { type: Number, default: 0 },
  correct: { type: Number, default: 0 },
  wrong: { type: Number, default: 0 },
  skipped: { type: Number, default: 0 },
  score: { type: Number, default: 0 }
});

const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    correctAnswers: {
      type: Number,
      required: true,
    },
    wrongAnswers: {
      type: Number,
      required: true,
    },
    unattempted: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      default: "0m 0s",
    },
    answers: [answerSchema],
    violations: {
      type: Number,
      default: 0,
    },
    subjectBreakdown: [subjectBreakdownSchema],
  },
  {
    timestamps: true,
  }
);

const Result = mongoose.model("Result", resultSchema);

export default Result;
