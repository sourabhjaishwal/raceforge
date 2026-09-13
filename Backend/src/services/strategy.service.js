const Strategy = require("../models/strategy.model");
const Race = require("../models/race.model");
const Driver = require("../models/driver.model");
const RaceSimulation = require("./race.simulation.service");

class StrategyService {
  async createStrategy(strategyData) {
    return Strategy.create(strategyData);
  }

  async getStrategy(strategyId, userId = null) {
    const query = {
      _id: strategyId,
    };

    if (userId) {
      query.user = userId;
    }

    const strategy = await Strategy.findOne(query)
      .populate({
        path: "race",
        populate: {
          path: "circuit",
        },
      })
      .populate("driver");

    if (!strategy) {
      throw new Error("Strategy not found");
    }

    return strategy;
  }

  async getUserStrategies(userId) {
    return Strategy.find({
      user: userId,
    })
      .populate({
        path: "race",
        populate: {
          path: "circuit",
        },
      })
      .populate("driver")
      .sort({
        createdAt: -1,
      });
  }

  async analyzeStrategy(strategyId, userId) {
    const strategy = await this.getStrategy(strategyId, userId);

    const race = await Race.findById(strategy.race._id).populate("circuit");

    const driver = await Driver.findById(strategy.driver._id);

    if (!race) {
      throw new Error("Race not found");
    }

    if (!driver) {
      throw new Error("Driver not found");
    }

    const result = await RaceSimulation.simulateRace(strategy, race, driver);

    if (!result.success) {
      throw new Error(result.error);
    }

    strategy.simulation = result.simulation;

    strategy.status = "analyzed";

    await strategy.save();

    return strategy;
  }

  async updateStrategy(strategyId, userId, updates) {
    const strategy = await this.getStrategy(strategyId, userId);

    if (strategy.status !== "draft") {
      throw new Error("Can only edit draft strategies");
    }

    const allowedFields = [
      "name",
      "description",
      "pitStops",
      "startingTire",
      "fuelTarget",
      "riskFactors",
    ];

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(updates, field)) {
        strategy[field] = updates[field];
      }
    }

    await strategy.save();

    return strategy;
  }

  async deleteStrategy(strategyId, userId) {
    const strategy = await Strategy.findOneAndDelete({
      _id: strategyId,
      user: userId,
    });

    if (!strategy) {
      throw new Error("Strategy not found");
    }

    return strategy;
  }
}

module.exports = new StrategyService();
