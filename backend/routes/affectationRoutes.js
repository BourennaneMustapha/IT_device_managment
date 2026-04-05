import express from "express";
import {
  assignDevice,
  reassignDevice,
  returnDevice,
  repairDevice,
  getAllAffectations
} from "../controllers/affectationController.js";
import {isLogin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/assign", isLogin,assignDevice);
router.post("/reassign",isLogin, reassignDevice);
router.post("/return",isLogin, returnDevice);
router.post("/repair", isLogin, repairDevice);
router.get("/getAll", isLogin, getAllAffectations);


export default router;
