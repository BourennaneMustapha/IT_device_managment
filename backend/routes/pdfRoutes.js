import express from "express";
import { generateAffectationPdf } from "../controllers/generateAffectationPdf.js";

const router = express.Router();

// Generate PDF by employee ID
router.get("/employee-pdf/:employeeId", generateAffectationPdf);

export default router;
