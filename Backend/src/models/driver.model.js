const mongoose = require("mongoose");

/**
 * @name Driver Model
 * @description F1 driver information used by races and strategy simulation
 */

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Driver name required"],
      trim: true,
    },

    shortName: {
      type: String,
      required: [true, "Driver short name required"],
      uppercase: true,
      trim: true,
      maxlength: 3,
    },

    number: {
      type: Number,
      required: [true, "Driver number required"],
      min: 1,
      max: 99,
    },

    nationality: {
      type: String,
      required: [true, "Driver nationality required"],
      trim: true,
    },

    team: {
      type: String,
      required: [true, "Driver team required"],
      trim: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 0.8,
      max: 1.2,
      default: 1.0,
    },

    // Driver attributes used by the strategy engine
    attributes: {
      racecraft: {
        type: Number,
        min: 0,
        max: 100,
        default: 80,
      },

      qualifying: {
        type: Number,
        min: 0,
        max: 100,
        default: 80,
      },

      tireManagement: {
        type: Number,
        min: 0,
        max: 100,
        default: 80,
      },

      wetWeather: {
        type: Number,
        min: 0,
        max: 100,
        default: 80,
      },

      consistency: {
        type: Number,
        min: 0,
        max: 100,
        default: 80,
      },
    },

    status: {
      type: String,
      enum: ["active", "reserve", "inactive"],
      default: "active",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Useful indexes
driverSchema.index({ name: 1 });
driverSchema.index({ team: 1 });
driverSchema.index({ number: 1 });
driverSchema.index({ active: 1 });

module.exports = mongoose.model("Driver", driverSchema);
