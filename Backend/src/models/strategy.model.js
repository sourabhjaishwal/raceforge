const mongoose = require("mongoose");

const pitStopSchema = new mongoose.Schema(
  {
    stopNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },

    lap: {
      type: Number,
      required: true,
      min: 1,
    },

    tireCompound: {
      type: String,
      enum: ["soft", "medium", "hard", "intermediate", "wet"],
      required: true,
    },

    estimatedDuration: {
      type: Number,
      default: null,
    },
  },
  { _id: false },
);

const simulationSchema = new mongoose.Schema(
  {
    predictedFinishingPosition: Number,

    predictedTime: String,

    totalTime: Number,

    timeGainLoss: Number,

    lapTimes: {
      type: [Number],
      default: [],
    },

    riskScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    confidence: {
      type: Number,
      min: 0,
      max: 100,
    },

    weather: {
      condition: String,
      temperature: Number,
      humidity: Number,
      windSpeed: Number,
      rainProbability: Number,
      weatherRiskFactor: Number,
    },

    fuel: {
      required: Number,
      target: Number,
      margin: Number,
    },

    pitStops: {
      count: Number,
      totalPitTime: Number,
    },

    notes: String,
  },
  { _id: false },
);

const strategySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference required"],
      index: true,
    },

    race: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Race",
      required: [true, "Race reference required"],
      index: true,
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: [true, "Driver reference required"],
    },

    name: {
      type: String,
      required: [true, "Strategy name required"],
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    startingTire: {
      type: String,
      enum: ["soft", "medium", "hard", "intermediate", "wet"],
      required: [true, "Starting tire required"],
    },

    pitStops: {
      type: [pitStopSchema],
      default: [],
    },

    fuelTarget: {
      type: Number,
      required: [true, "Fuel target required"],
      min: 1,
    },

    riskFactors: {
      type: [String],
      default: [],
    },

    simulation: simulationSchema,

    status: {
      type: String,
      enum: ["draft", "submitted", "analyzed", "completed"],
      default: "draft",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Strategy", strategySchema);
