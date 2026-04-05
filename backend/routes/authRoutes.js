import express from "express";
import {
  register,
  login,
  Logout,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  masterLogin,
  masterLogout,
  fetchUser,
} from "../controllers/authController.js";

import { protect, isLogin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/master-login", masterLogin);
router.post("/master-logout", masterLogout);
// Protected register admin management routes
router.post("/register", protect, register);
router.get("/register-admin", protect, getAdmin);
router.put("/register-admin/:id", protect, updateAdmin);
router.delete("/register-admin/:id", protect, deleteAdmin);

router.post("/login", login);
router.get("/getuser", isLogin, fetchUser);
router.post("/logout", Logout);

// Protected adding devices management routes

export default router;
