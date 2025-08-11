require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const mysql = require("mysql2/promise");

// Import routes
const authRoutes = require("./routes/auth.routes");

// Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: "https://smscqhk3-3000.inc1.devtunnels.ms",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the API!");
});

// API routes
app.use("/api/auth", authRoutes);

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  (async () => {
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
      await connection.ping();
      console.log("Connected to MySQL database successfully.");
      await connection.end();
    } catch (err) {
      console.error("Failed to connect to MySQL database:", err.message);
    }
  })();
  console.log(`Server is running on port ${PORT}`);
});
