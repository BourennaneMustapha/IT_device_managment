// middleware/protect.js
import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const token =
      req.cookies?.masterToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "master") {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const isLogin = (req, res, next) => {
  const token = req.cookies.token
  if (!token)
    return res.status(401).json({ success: false, message: "Not authorized" })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // {id : ....}
    next()
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" })
  }
}
