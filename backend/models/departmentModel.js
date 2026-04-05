import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    direction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Direction",
      required: true,
    },
  },
  { timestamps: true },
);
export default mongoose.model("Department", departmentSchema);
