import mongoose from "mongoose";

const topperSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  subTitle: {
    type: String,
    default: "Aspirant",
    trim: true
  },
  rank: {
    type: String,
    default: "AIR 1",
    trim: true
  },
  totalTests: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 0
  },
  score: {
    type: String,
    default: "0/0"
  },
  avatar: {
    type: String,
    default: "https://i.pravatar.cc/40"
  },
  isAutomatic: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Topper = mongoose.model("Topper", topperSchema);
export default Topper;
