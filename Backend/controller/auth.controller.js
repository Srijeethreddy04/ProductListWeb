// controller/auth.controller.js
import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const verify = (req, res) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // You can also check the user in DB if needed
    res.status(200).json({ success: true, userId: decoded.userId, email: decoded.email, role: decoded.role });
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};


export const register = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) 
    return res.status(400).json({ success: false, message: "Email and password are required" });
  if (password.length < 6)
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, role: role || "user" });
    res.json({ success: true, user: { email: user.email, _id: user._id, role: user.role } });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: "Email and password are required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ success: true, token, user: { email: user.email, _id: user._id, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Login failed" });
  }
};
