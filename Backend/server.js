// server.js (or your main entry file)
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import path from "path";
dotenv.config();

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendBuildPath = path.join(__dirname, "../frontend/dist");

  // Serve static files from the React frontend build
  app.use(express.static(frontendBuildPath));

  // Fix for Express 5+ - name the wildcard parameter
// Fix wildcard route for Express 5+ compatibility
app.get("/*", (req, res) => {
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});
} else {
  // Serve frontend in development mode
  app.get("/", (req, res) => {  
    res.send("API is running...");
  });
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
  });
  

}

app.listen(PORT, () => {
  connectDB();
  console.log(`Server started at http://localhost:${PORT}`);
});
