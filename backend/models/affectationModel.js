import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ["assign", "reassign", "return", "repair"],
    required: true,
  },
  user: { type: String, required: true }, // user who did the action
  employee : {type : String , require : true},
  date: { type: Date, default: Date.now },
});

const affectationSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },
    employeeName: { type: String, required: true },
    deviceBS: { type: String, required: true },

    deviceName: { type: String, required: true },

    status: {
      type: String,
      enum: ["assigned", "returned", "reassigned", "repair"],
      default: "assigned",
    },

    history: [historySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Affectation", affectationSchema);
