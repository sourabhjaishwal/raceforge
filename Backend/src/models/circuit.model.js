const mongoose = require("mongoose");

const circuitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    location: {
      city: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },

    length: {
      type: Number,
      required: true,
    },

    laps: {
      type: Number,
      required: true,
    },

    characteristics: {
      type: [String],
      default: [],
    },

    activeAeroZones: {
      type: Number,
      default: 0,
    },

    safetyCarFrequency: {
      type: String,
      enum: ["low", "medium", "high", "very-high"],
      default: "medium",
    },

    typicalWeather: {
      temperature: {
        type: Number,
      },

      humidity: {
        type: Number,
      },

      windSpeed: {
        type: Number,
      },

      condition: {
        type: String,
      },

      rainProbability: {
        type: Number,
      },
    },

    lapRecord: {
      time: {
        type: String,
      },

      driver: {
        type: String,
      },

      year: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Circuit", circuitSchema);
