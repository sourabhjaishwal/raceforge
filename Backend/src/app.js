const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const strategyRoutes = require("./routes/strategy.routes");
const raceRoutes = require("./routes/race.routes");
const driverRoutes = require("./routes/driver.routes");
const errorHandler = require("./middlewares/error.handler");

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/strategies", strategyRoutes);
app.use("/api/v1/races", raceRoutes);
app.use("/api/v1/drivers", driverRoutes);

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

// Error handler
app.use(errorHandler);

module.exports = app;
