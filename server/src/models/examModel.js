import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    eligibility: { type: String, required: true },
    pattern: { type: String, required: true },
    vacancies: { type: String, required: true },
    syllabusLink: { type: String, default: "#" }
  },
  { timestamps: true }
);

export default mongoose.model("Exam", examSchema);
