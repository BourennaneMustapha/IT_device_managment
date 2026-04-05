import express from "express";
import {
  createDevice,
  getAllDevices,
  getDevice,
  updateDevice,
  deleteDevice
} from "../controllers/deviceController.js";
import {isLogin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/addDevice",  isLogin,createDevice);
router.get("/getAllDevice",  isLogin,getAllDevices);
router.get("/getDevice/:id",  isLogin, getDevice);
router.put("/updateDevice/:id", isLogin, updateDevice);
router.delete("/deleteDevice/:id",  isLogin,deleteDevice);

export default router;
