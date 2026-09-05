const WeatherService = require("./weather.service");

/**
 * @name Tire Strategy Service
 * @description Tire pace and degradation calculations.
 */

class TireStrategy {
  getTireDegradation(compound) {
    const degradationCurves = {
      soft: {
        baseTime: 80,
        degradationPerLap: 0.08,
        maxLaps: 25,
        criticalLap: 30,
      },

      medium: {
        baseTime: 82,
        degradationPerLap: 0.05,
        maxLaps: 35,
        criticalLap: 45,
      },

      hard: {
        baseTime: 84,
        degradationPerLap: 0.03,
        maxLaps: 50,
        criticalLap: 60,
      },
    };

    return degradationCurves[compound] || degradationCurves.medium;
  }

  calculateLapTime(compound, lapAge, driverRating = 1.0, weather = "mild") {
    const curve = this.getTireDegradation(compound);

    const degradation = lapAge * curve.degradationPerLap;

    const weatherMultiplier =
      WeatherService.getTireDegradationMultiplier(weather);

    const adjustedDegradation = degradation * weatherMultiplier;

    const adjustedDriverRating = WeatherService.getDriverRatingAdjustment(
      weather,
      driverRating,
    );

    return (curve.baseTime + adjustedDegradation) * adjustedDriverRating;
  }

  isTireViable(compound, lapAge, lapsRemaining) {
    const curve = this.getTireDegradation(compound);

    return lapAge + lapsRemaining <= curve.criticalLap;
  }

  getRecommendedMaxStint(compound) {
    return this.getTireDegradation(compound).maxLaps;
  }
}

module.exports = new TireStrategy();
