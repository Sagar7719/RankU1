import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Plan name is required"],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: [true, "Price is required"]
    },
    originalPrice: {
      type: Number,
      required: [true, "Original price is required"]
    },
    discountPercentage: {
      type: String,
      trim: true
    },
    duration: {
      type: String,
      required: [true, "Duration is required"]
    },
    features: {
      type: [String],
      default: []
    },
    isRecommended: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Plan = mongoose.model("Plan", planSchema);

export default Plan;
