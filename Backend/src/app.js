const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/v1/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is up and running",
    timestamp: new Date().toISOString(),
  });
});

// Error - 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

module.exports = app;
