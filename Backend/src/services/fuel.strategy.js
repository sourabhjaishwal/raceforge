const WeatherService = require("./weather.service");

/**
 * @name Fuel Strategy Service
 * @description Fuel consumption and race fuel calculations.
 */

class FuelStrategy {
  getFuelConsumption(
    trackCharacteristics = [],
    weather = "mild"
  ) {
    const characteristics = Array.isArray(
      trackCharacteristics
    )
      ? trackCharacteristics
      : [trackCharacteristics];

    let baseConsumption = 1.2;

    if (
      characteristics.some((x) =>
        x.includes("high-speed")
      )
    ) {
      baseConsumption += 0.15;
    }

    if (
      characteristics.some((x) =>
        x.includes("long-straight")
      )
    ) {
      baseConsumption += 0.08;
    }

    if (
      characteristics.some((x) =>
        x.includes("heavy-braking")
      )
    ) {
      baseConsumption += 0.05;
    }

    if (
      characteristics.some((x) =>
        x.includes("street")
      )
    ) {
      baseConsumption += 0.03;
    }

    if (
      characteristics.some((x) =>
        x.includes("high-altitude")
      )
    ) {
      baseConsumption += 0.04;
    }

    const weatherMultiplier =
      WeatherService.getFuelConsumptionMultiplier(
        weather
      );

    return baseConsumption * weatherMultiplier;
  }

  calculateTotalFuelNeeded(
    totalLaps,
    trackCharacteristics = [],
    weather = "mild",
    safetyCarFactor = 1.05
  ) {
    const perLap = this.getFuelConsumption(
      trackCharacteristics,
      weather
    );

    const total =
      totalLaps *
      perLap *
      safetyCarFactor;

    return Math.round(total * 10) / 10;
  }

  calculateFuelAtLap(
    currentLap,
    fuelStart,
    trackCharacteristics = [],
    weather = "mild"
  ) {
    const perLap = this.getFuelConsumption(
      trackCharacteristics,
      weather
    );

    const consumed =
      currentLap * perLap;

    return Math.max(
      0,
      fuelStart - consumed
    );
  }

  willCompleteRace(
    fuelStart,
    totalLaps,
    trackCharacteristics = [],
    weather = "mild"
  ) {
    const needed =
      this.calculateTotalFuelNeeded(
        totalLaps,
        trackCharacteristics,
        weather
      );

    return fuelStart >= needed;
  }
}

module.exports = new FuelStrategy();
