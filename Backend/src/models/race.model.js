const mongoose = require("mongoose");

/**
 * @name Race Model
 * @description Represents an F1 race weekend
 */

const raceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Race name required"],
      trim: true,
    },

    season: {
      type: Number,
      required: [true, "Season required"],
    },

    round: {
      type: Number,
      required: [true, "Round required"],
    },

    circuit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Circuit",
      required: [true, "Circuit reference required"],
    },

    date: {
      type: Date,
      required: [true, "Race date required"],
    },

    laps: {
      type: Number,
      required: [true, "Race laps required"],
      min: 1,
    },

    status: {
      type: String,
      enum: ["upcoming", "live", "completed"],
      default: "upcoming",
    },

    weather: {
      condition: {
        type: String,
        enum: ["dry", "mild", "cool", "windy", "hot", "rain"],
        default: "mild",
      },

      temperature: {
        type: Number,
        default: 20,
      },

      humidity: {
        type: Number,
        default: 55,
      },

      windSpeed: {
        type: Number,
        default: 10,
      },

      rainProbability: {
        type: Number,
        min: 0,
        max: 100,
        default: 10,
      },
    },
  },
  {
    timestamps: true,
  },
);

raceSchema.index({ season: 1, round: 1 }, { unique: true });
raceSchema.index({ date: 1 });
raceSchema.index({ status: 1 });

module.exports = mongoose.model("Race", raceSchema);
