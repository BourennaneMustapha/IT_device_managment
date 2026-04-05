import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  type: { type: String, required: true },
  model: { type: String, required: true },
  marque: { type: String, required: true },
  specs: {
    os: String,
    ram: String,
    cpu: String,
  },
  stock: { type: Number, required: true, default: 0 }, // real available stock
  assigned: { type: Number, default: 0 },              // how many are assigned
}, { timestamps: true });

export default mongoose.model("Device", deviceSchema);
