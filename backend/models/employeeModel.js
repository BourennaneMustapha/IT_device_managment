import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    matricule: { type: String, required: true, unique: true },
    status: { type: String },
    depart: { type: String, required: true },
    post: { type: String, required: true },
  },
  { timestamps: true }
);

export const Employee = mongoose.model("Employee", employeeSchema);
