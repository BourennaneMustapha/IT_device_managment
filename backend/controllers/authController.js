import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User} from "../models/Models.js";

// Helper: Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "4h",
  });
};

// ✅ MASTER LOGIN — saves token in HTTP-only cookie
export const masterLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      username === process.env.MASTER_USERNAME &&
      password === process.env.MASTER_PASSWORD
    ) {
      const token = jwt.sign({ role: "master" }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // ✅ Store token in cookie (HTTP-only)
      res.cookie("masterToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      return res.status(200).json({
        success: true,
        message: "Master access granted",
        token,
      });
    }

    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// LOGOUT MASTER LOGIN

export const masterLogout = (req, res) => {
  try {
    res.clearCookie("masterToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(200).json({
      success: true,
      message: "master logout seccessfully",
    });
  } catch (error) {
    console.error("Logout error :", error);
    return res.status(500).json({
      success: false,
      message: "server error during Logout",
    });
  }
};
//  REGISTER NEW ADMIN (protected by master token)
export const register = async (req, res) => {
  try {
    const { name, password } = req.body;

    // Validate fields
    if (!name || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({ name, password: hashedPassword });
    await user.save();

    // Respond with success
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { id: user._id, name: user.name },
    });
  } catch (error) {
    console.error(" Register error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
// GET ALL USERS
export const getAdmin = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide passwords
    res.json({ users }); // ✅ wrap in object
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  UPDATE ADMIN
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password } = req.body;

    const updateData = { name };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  DELETE ADMIN
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//  LOGIN ADMIN
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(req.body);

    const user = await User.findOne({ name: username });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });

    const token = generateToken(user._id);
    // store token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    console.log(token);
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }
    res.status(200).json({
      success: true,
      user
    })
  } catch (err) {
   res.status(500).json({
  success: false,
  message: err.message,
});
   }
}
//  LOGOUT ADMIN
export const Logout = (req, res) => {
  try {
    res.clearCookie("Token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    console.log("the token is cleared");
    return res.status(200).json({
      success: true,
      message: "logout seccessfully",
    });
  } catch (error) {
    console.error("Logout error :", error);
    return res.status(500).json({
      success: false,
      message: "server error during Logout",
    });
  }
};



