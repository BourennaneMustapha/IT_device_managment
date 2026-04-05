import express from "express";
import {
  createDirection,
  createDepartment,
  createPosition,
  getFullTree,
  getPosByDepart,
  updateDirection,
  updateDepartment,
  updatePosition,
  deleteDirection,
  deleteDepartment,
  deletePosition,
} from "../controllers/orgController.js";
import { isLogin } from "../middleware/authMiddleware.js";
const router = express.Router();

// TREE
router.get("/directions/full",isLogin, getFullTree);
router.get("/directions/getall",isLogin, getPosByDepart);
// CREATE
router.post("/directions", isLogin,createDirection);
router.post("/departments",isLogin, createDepartment);
router.post("/positions",isLogin, createPosition);

// UPDATE
router.put("/directions/:id", isLogin,updateDirection);
router.put("/departments/:id", isLogin,updateDepartment);
router.put("/positions/:id", isLogin,updatePosition);

// DELETE
router.delete("/directions/:id", isLogin,deleteDirection);
router.delete("/departments/:id",isLogin, deleteDepartment);
router.delete("/positions/:id",isLogin, deletePosition);

export default router;