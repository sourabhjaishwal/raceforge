const TireStrategy = require("./tire.strategy");
const FuelStrategy = require("./fuel.strategy");
const PitStopService = require("./pit.stop.service");
const WeatherService = require("./weather.service");

class RaceSimulation {
  async simulateRace(strategyInput, raceData, driverData) {
    try {
      const totalLaps = raceData.laps || 60;

      const startingTire = strategyInput.startingTire;

      const pitStops = strategyInput.pitStops || [];

      const fuelTarget = Number(strategyInput.fuelTarget);

      const driverRating = Number(driverData.rating) || 1.0;

      const circuit = raceData.circuit || {};

      const trackCharacteristics = circuit.characteristics || [];

      const weather = WeatherService.getRaceWeather(raceData);

      /*
       * -----------------------------
       * PIT VALIDATION
       * -----------------------------
       */

      const pitValidation = PitStopService.calculatePitStrategy(
        pitStops,
        totalLaps,
      );

      if (!pitValidation.valid) {
        throw new Error(pitValidation.errors[0]);
      }

      /*
       * -----------------------------
       * FUEL
       * -----------------------------
       */

      const fuelNeeded = FuelStrategy.calculateTotalFuelNeeded(
        totalLaps,
        trackCharacteristics,
        weather.condition,
        1.05,
      );

      if (fuelTarget < fuelNeeded) {
        throw new Error(
          `Insufficient fuel: need ${fuelNeeded}kg, have ${fuelTarget}kg`,
        );
      }

      /*
       * -----------------------------
       * WEATHER
       * -----------------------------
       */

      const weatherRisk = WeatherService.getWeatherRiskFactor(
        weather.condition,
      );

      /*
       * -----------------------------
       * SIMULATION
       * -----------------------------
       */

      let totalTime = 0;

      let currentTire = startingTire;

      let lapAge = 0;

      const lapTimes = [];

      let totalPitTime = 0;

      const pitStopMap = new Map();

      for (const stop of pitStops) {
        pitStopMap.set(stop.lap, stop);
      }

      /*
       * Race laps
       */

      for (let lap = 1; lap <= totalLaps; lap++) {
        /*
         * NORMAL LAP
         */

        const lapTime = TireStrategy.calculateLapTime(
          currentTire,
          lapAge,
          driverRating,
          weather.condition,
        );

        totalTime += lapTime;

        lapTimes.push(lapTime);

        lapAge++;

        /*
         * Tire viability
         *
         * The tire only needs to survive until the next
         * scheduled pit stop. The current lap has already
         * been completed.
         */

        const isPitLap = pitStopMap.has(lap);

        if (!isPitLap) {
          const nextPitLap = pitStops
            .map((stop) => Number(stop.lap))
            .filter((pitLap) => pitLap > lap)
            .sort((a, b) => a - b)[0];

          const lapsUntilNextPit = nextPitLap
            ? nextPitLap - lap
            : totalLaps - lap;

          if (
            !TireStrategy.isTireViable(currentTire, lapAge, lapsUntilNextPit)
          ) {
            throw new Error(
              `Tire failure at lap ${lap}: ${currentTire} compound not viable`,
            );
          }
        }

        /*
         * PIT STOP AFTER COMPLETING THIS LAP
         */

        if (pitStopMap.has(lap)) {
          const pit = pitStopMap.get(lap);

          const pitDuration = PitStopService.getPitStopDuration(4, 1.0);

          const lapLoss = PitStopService.calculateLapLossFromPit(
            pitDuration,
            80,
          );

          totalTime += lapLoss;

          totalPitTime += pitDuration;

          currentTire = pit.tireCompound;

          lapAge = 0;
        }
      }

      /*
       * -----------------------------
       * RESULTS
       * -----------------------------
       */

      const predictedTime = this.formatRaceTime(totalTime);

      /*
       * Baseline
       *
       * This is still a simplified MVP
       * benchmark.
       */

      const baselineLapTime = 82;

      const baselineTime = totalLaps * baselineLapTime;

      const timeGainLoss = totalTime - baselineTime;

      const estimatedPosition = Math.max(
        1,
        Math.min(20, 10 + Math.round(timeGainLoss / 50)),
      );

      /*
       * Risk
       */

      const riskScore = this.calculateRiskScore(
        strategyInput.riskFactors,
        pitStops.length,
        fuelTarget - fuelNeeded,
        weatherRisk,
      );

      /*
       * Confidence
       */

      const confidence = Math.max(0, 100 - riskScore);

      return {
        success: true,

        simulation: {
          predictedFinishingPosition: estimatedPosition,

          predictedTime,

          totalTime,

          timeGainLoss: Math.round(timeGainLoss),

          lapTimes,

          riskScore,

          confidence,

          weather: {
            condition: weather.condition,

            temperature: weather.temperature,

            humidity: weather.humidity,

            windSpeed: weather.windSpeed,

            rainProbability: weather.rainProbability,

            weatherRiskFactor: weatherRisk,
          },

          fuel: {
            required: fuelNeeded,

            target: fuelTarget,

            margin: Math.round((fuelTarget - fuelNeeded) * 10) / 10,
          },

          pitStops: {
            count: pitStops.length,

            totalPitTime,
          },

          notes:
            `${weather.condition} conditions. ` +
            `${pitStops.length} pit stops. ` +
            `Fuel margin: ${Math.round(fuelTarget - fuelNeeded)}kg.`,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  calculateRiskScore(
    riskFactors = [],
    pitStopCount,
    fuelMargin,
    weatherRisk = 0,
  ) {
    let score = weatherRisk;

    /*
     * Pit stops
     */

    if (pitStopCount >= 3) {
      score += 30;
    } else if (pitStopCount === 2) {
      score += 15;
    }

    /*
     * Fuel margin
     */

    if (fuelMargin < 5) {
      score += 40;
    } else if (fuelMargin < 10) {
      score += 20;
    }

    /*
     * Explicit risk factors
     */

    if (riskFactors.includes("reliability")) {
      score += 20;
    }

    if (riskFactors.includes("pit_crew_error")) {
      score += 15;
    }

    /*
     * Don't add another 25 for "weather"
     * because weatherRisk already includes it.
     */

    return Math.min(100, score);
  }

  formatRaceTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);

    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const seconds = (totalSeconds % 60).toFixed(3);

    return (
      `${hours}:` +
      `${String(minutes).padStart(2, "0")}:` +
      `${seconds.padStart(6, "0")}`
    );
  }
}

module.exports = new RaceSimulation();
