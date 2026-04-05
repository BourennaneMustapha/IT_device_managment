import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import deviceRoutes from "./routes/deviceRoutes.js";
import affectationRoutes from "./routes/affectationRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js"
import pdfRoutes from "./routes/pdfRoutes.js";
import orgRoutes from "./routes/orgRoutes.js"
dotenv.config();
connectDB();

const app = express();

// ✅ Always parse JSON & cookies before CORS
app.use(express.json());
app.use(cookieParser());

// ✅ Proper CORS setup
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // allow cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees",employeeRoutes)
app.use("/api/devices", deviceRoutes);
app.use("/api/affectations", affectationRoutes);
app.use("/api", pdfRoutes);
app.use("/api", orgRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
