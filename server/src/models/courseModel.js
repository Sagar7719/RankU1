import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    exam: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, default: 0 },
    isFree: { type: Boolean, default: false },
    badgeText: { type: String, default: "" },
    tagText: { type: String, default: "" },
    students: { type: String, default: "1.2k+" },
    rating: { type: String, default: "4.9" },
    duration: { type: String, required: true },
    image: { type: String, default: null },
    gradient: { type: String, default: "linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%)" }
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
