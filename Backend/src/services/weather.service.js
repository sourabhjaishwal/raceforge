/**
 * @name Weather Service
 * @description Converts circuit/race weather into simulation effects.
 */

class WeatherService {
  /**
   * Normalize arbitrary seeded weather condition
   * into simulation categories.
   */
  normalizeCondition(condition = "") {
    const value = condition.toLowerCase();

    if (
      value.includes("rain") ||
      value.includes("storm") ||
      value.includes("unstable")
    ) {
      return "rain";
    }

    if (
      value.includes("hot") ||
      value.includes("scorching") ||
      value.includes("humid") ||
      value.includes("stifling")
    ) {
      return "hot";
    }

    if (value.includes("cold") || value.includes("cool")) {
      return "cool";
    }

    if (value.includes("wind") || value.includes("gust")) {
      return "windy";
    }

    if (
      value.includes("sunny") ||
      value.includes("clear") ||
      value.includes("pleasant")
    ) {
      return "dry";
    }

    return "mild";
  }

  /**
   * Get weather from race.
   *
   * Race weather is preferred because it represents
   * the actual race snapshot.
   */
  getRaceWeather(raceData = {}) {
    if (raceData.weather) {
      return raceData.weather;
    }

    if (raceData.circuit?.typicalWeather) {
      return raceData.circuit.typicalWeather;
    }

    return {
      condition: "mild",
      temperature: 20,
      humidity: 55,
      windSpeed: 10,
      rainProbability: 10,
    };
  }

  /**
   * Tire degradation multiplier.
   */
  getTireDegradationMultiplier(weather) {
    const condition = this.normalizeCondition(weather);

    const multipliers = {
      dry: 1.0,
      mild: 1.0,
      cool: 0.95,
      windy: 1.03,
      hot: 1.2,
      rain: 0.85,
    };

    return multipliers[condition] || 1.0;
  }

  /**
   * Fuel consumption multiplier.
   */
  getFuelConsumptionMultiplier(weather) {
    const condition = this.normalizeCondition(weather);

    const multipliers = {
      dry: 1.0,
      mild: 1.0,
      cool: 0.98,
      windy: 1.03,
      hot: 1.12,
      rain: 0.9,
    };

    return multipliers[condition] || 1.0;
  }

  /**
   * Weather risk.
   */
  getWeatherRiskFactor(weather) {
    const condition = this.normalizeCondition(weather);

    const risks = {
      dry: 0,
      mild: 2,
      cool: 2,
      windy: 8,
      hot: 15,
      rain: 25,
    };

    return risks[condition] || 0;
  }

  /**
   * Driver adjustment.
   */
  getDriverRatingAdjustment(weather, baseRating = 1.0) {
    const condition = this.normalizeCondition(weather);

    if (condition === "rain") {
      return baseRating + 0.05;
    }

    if (condition === "hot") {
      return baseRating - 0.03;
    }

    if (condition === "windy") {
      return baseRating - 0.02;
    }

    return baseRating;
  }
}

module.exports = new WeatherService();
