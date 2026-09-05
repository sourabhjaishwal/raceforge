/**
 * @name Pit Stop Service
 * @description Pit stop timing and validation.
 */

class PitStopService {
  getPitStopDuration(numberOfTires = 4, crewSkill = 1.0) {
    const baseTime = 22;
    const tireChangeTime = 2.5;

    const totalTime = baseTime + numberOfTires * tireChangeTime;

    return Math.round(totalTime * (1 / crewSkill));
  }

  calculateLapLossFromPit(pitDuration, lapTime = 80) {
    const pitLaneLoss = 8;
    const accelerationLoss = 3;

    return pitDuration + pitLaneLoss + accelerationLoss;
  }

  validatePitStopLap(stopLap, previousStops = [], totalLaps = Infinity) {
    if (stopLap < 3) {
      return {
        valid: false,
        error: "Cannot pit in first 2 laps",
      };
    }

    if (stopLap >= totalLaps) {
      return {
        valid: false,
        error: "Pit stop must occur before final lap",
      };
    }

    for (const previousLap of previousStops) {
      if (Math.abs(stopLap - previousLap) < 5) {
        return {
          valid: false,
          error: "Minimum 5 laps between pit stops",
        };
      }
    }

    return {
      valid: true,
      error: null,
    };
  }

  calculatePitStrategy(pitStops = [], totalLaps) {
    const errors = [];

    if (pitStops.length < 1 || pitStops.length > 4) {
      errors.push("Must have 1-4 pit stops");
    }

    const previousStops = [];

    for (let i = 0; i < pitStops.length; i++) {
      const stop = pitStops[i];

      if (!stop.lap) {
        errors.push(`Stop ${i + 1}: lap is required`);
        continue;
      }

      if (stop.lap >= totalLaps) {
        errors.push(`Stop ${i + 1}: pit lap must be before final lap`);
      }

      const validation = this.validatePitStopLap(
        stop.lap,
        previousStops,
        totalLaps,
      );

      if (!validation.valid) {
        errors.push(`Stop ${i + 1}: ${validation.error}`);
      }

      if (!["soft", "medium", "hard"].includes(stop.tireCompound)) {
        errors.push(`Stop ${i + 1}: invalid tire compound`);
      }

      previousStops.push(stop.lap);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

module.exports = new PitStopService();
