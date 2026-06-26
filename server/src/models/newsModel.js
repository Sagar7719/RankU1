import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    default: "GENERAL",
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  image: {
    type: String, // URL or Base64
    default: ""
  },
  description: {
    type: String,
    required: true
  },
  fullContent: {
    type: String,
    required: true
  },
  author: {
    type: String,
    default: "RankU1 Team"
  }
}, { timestamps: true });

const News = mongoose.model("News", newsSchema);
export default News;
