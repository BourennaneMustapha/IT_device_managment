import Device from "../models/deviceModel.js";
import Affectation from "../models/affectationModel.js";

/* --------------------- ASSIGN DEVICE --------------------- */
export const assignDevice = async (req, res) => {
  try {
    const { employeeId, deviceId, deviceName, employeeName, user , deviceBS } = req.body;
    

    const device = await Device.findById(deviceId);
    if (!device || device.stock <= 0) {
      return res.status(400).json({ message: "No stock available" });
    }

    device.stock -= 1;
    device.assigned += 1;

    if (device.stock === 0) device.status = "out_of_stock";

    await device.save();

    const affect = await Affectation.create({
      employeeId,
      deviceId,
      deviceName,
      employeeName,
      status: "assigned",
      history: [{ action: "assign", user, employee: employeeName }],
      deviceBS,
    });

    res.status(201).json(affect);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* --------------------- REASSIGN DEVICE --------------------- */
export const reassignDevice = async (req, res) => {
  try {
    const { affectationId, newEmployeeId, employeeName, user ,deviceBS } = req.body;

    const affect = await Affectation.findById(affectationId);
    if (!affect) {
      return res.status(404).json({ message: "Affectation not found" });
    }

    const device = await Device.findById(affect.deviceId);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    // ❌ Prevent reassign if no stock available
    if (affect.status === "returned" && device.stock <= 0) {
      return res.status(400).json({
        message: "No available stock to reassign this device",
      });
    }

    // ✅ If device was returned or repair → reassign it again
    if (affect.status === "returned") {
      device.stock -= 1;
      device.assigned += 1;
    }

    device.status = device.stock === 0 ? "out_of_stock" : "available";
    await device.save();

    // ✅ Update affectation
    affect.employeeId = newEmployeeId;
    affect.employeeName = employeeName;
    // SAFETY: Use body deviceBS, but if it's missing, keep the old one
    affect.deviceBS = deviceBS || affect.deviceBS;
    affect.status = "assigned";
    affect.history.push({
      action: "reassign",
      user,
      date: new Date(),
      employee: employeeName,
    });

    await affect.save();

    res.json(affect);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* --------------------- RETURN DEVICE --------------------- */
export const returnDevice = async (req, res) => {
  try {
    const { affectationId, user } = req.body;

    const affect = await Affectation.findById(affectationId);
    if (!affect)
      return res.status(404).json({ message: "Affectation not found" });

    const device = await Device.findById(affect.deviceId);
    if (device.assigned <= 0 || affect.status === "returned") {
      return res
        .status(400)
        .json({
          message: "This device is not currently assigned or already returned",
        });
    } //test if device not assigned if correct prevent return to prevent -1 in stock

    device.stock += 1;
    device.assigned -= 1;
    device.status = "available";

    await device.save();

    affect.status = "returned";
    affect.history.push({ action: "return", user });

    await affect.save();

    res.json(affect);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* --------------------- SEND TO REPAIR --------------------- */
export const repairDevice = async (req, res) => {
  try {
    const { affectationId, user } = req.body;

    const affect = await Affectation.findById(affectationId);
    if (!affect)
      return res.status(404).json({ message: "Affectation not found" });

    const device = await Device.findById(affect.deviceId);

    if (affect.status === "repair") {
      return res.status(400).json({ message: "the device already on repair" });
    }

    device.status = "repair"; // ⭐ Do NOT change stock
    await device.save();

    affect.status = "repair";
    affect.history.push({
      action: "repair",
      user,
      employee: affect.employeeName,
    });

    await affect.save();

    res.json(affect);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAllAffectations = async (req, res) => {
  try {
    const affectations = await Affectation.find()
      .populate("employeeId", "firstName lastName matricule status depart post")
      .populate("deviceId", "marque model type specs")
      .sort({ createdAt: -1 });

    res.status(200).json(affectations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
