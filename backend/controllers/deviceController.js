import Device from "../models/deviceModel.js";

/* ---------------------- CREATE DEVICE ---------------------- */
export const createDevice = async (req, res) => {
  try {
    const device = await Device.create(req.body);
    res.status(201).json(device);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------------- ADD STOCK ---------------------- */
export const addStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const device = await Device.findById(id);
    if (!device) return res.status(404).json({ message: "Device not found" });

    device.stock += Number(quantity);
    if (device.stock > 0) device.status = "available";

    await device.save();

    res.json({ message: "Stock updated", device });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------------- GET ALL DEVICES ---------------------- */
export const getAllDevices = async (req, res) => {
  try {
    const devices = await Device.find().sort({ createdAt: -1 });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------- GET ONE DEVICE ---------------------- */
export const getDevice = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    res.json(device);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------- UPDATE DEVICE ---------------------- */
export const updateDevice = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    // ❗ Correct field: assigned
  {/*if (device.assigned > 0) {
      return res.status(400).json({
        message: "Cannot update a device that is currently assigned"
      });
    }
 */}  
    // ❗ Also block if in repair
    if (device.status === "repair") {
      return res.status(400).json({
        message: "Cannot update a device that is currently in repair"
      });
    }

    const updatedDevice = await Device.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedDevice);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------------- DELETE DEVICE ---------------------- */
export const deleteDevice = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    // ❗ Correct field: assigned
    if (device.assigned > 0) {
      return res.status(400).json({
        message: "Cannot delete a device that is currently assigned"
      });
    }

    if (device.status === "repair") {
      return res.status(400).json({
        message: "Cannot delete a device currently in repair"
      });
    }

    await Device.findByIdAndDelete(req.params.id);

    res.json({ message: "Device deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
