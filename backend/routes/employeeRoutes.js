import express from "express";
import {
  createEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee
} from "../controllers/employeeController.js";
import {  isLogin } from "../middleware/authMiddleware.js";
const router = express.Router();
// Protected adding employee management routes
router.post("/", isLogin,createEmployee);
router.get("/getall", isLogin,getAllEmployees);
router.get("/:id",isLogin, getEmployee);
router.put("/:id", isLogin,updateEmployee);
router.delete("/:id", isLogin,deleteEmployee);


export default router;
