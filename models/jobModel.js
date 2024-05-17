import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is required."],
    },
    position: {
      type: String,
      required: [true, "Position name is required."],
    },
    status: {
      type: String,
      enum: ["reject", "interview", "pending"],
      default: "pending",
    },
    workType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract"],
      default: "Full-time",
    },
    workLocation: {
      type: String,
      default: "Kathmandu",
      required: [true, "Work Location is required."],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
