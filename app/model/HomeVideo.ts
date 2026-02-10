import mongoose from "mongoose";

const HomeVideoSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      enum: ["youtube", "instagram", "facebook", "generic"],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.HomeVideo ||
  mongoose.model("HomeVideo", HomeVideoSchema);
