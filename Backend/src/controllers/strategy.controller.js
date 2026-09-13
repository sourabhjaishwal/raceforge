const StrategyService = require("../services/strategy.service");

class StrategyController {
  async create(req, res, next) {
    try {
      const {
        raceId,
        driverId,
        name,
        description,
        pitStops,
        startingTire,
        fuelTarget,
        riskFactors,
      } = req.body;

      if (
        !raceId ||
        !driverId ||
        !name ||
        !startingTire ||
        fuelTarget === undefined
      ) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields",
        });
      }

      const strategy = await StrategyService.createStrategy({
        user: req.user.userId,
        race: raceId,
        driver: driverId,
        name,
        description,
        pitStops: pitStops || [],
        startingTire,
        fuelTarget,
        riskFactors: riskFactors || [],
      });

      return res.status(201).json({
        success: true,
        message: "Strategy created",
        data: strategy,
      });
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    try {
      const strategy = await StrategyService.getStrategy(
        req.params.id,
        req.user.userId,
      );

      return res.json({
        success: true,
        data: strategy,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserStrategies(req, res, next) {
    try {
      const strategies = await StrategyService.getUserStrategies(
        req.user.userId,
      );

      return res.json({
        success: true,
        data: strategies,
      });
    } catch (error) {
      next(error);
    }
  }

  async analyze(req, res, next) {
    try {
      const strategy = await StrategyService.analyzeStrategy(
        req.params.id,
        req.user.userId,
      );

      return res.json({
        success: true,
        message: "Strategy analyzed",
        data: strategy,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const strategy = await StrategyService.updateStrategy(
        req.params.id,
        req.user.userId,
        req.body,
      );

      return res.json({
        success: true,
        message: "Strategy updated",
        data: strategy,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await StrategyService.deleteStrategy(req.params.id, req.user.userId);

      return res.json({
        success: true,
        message: "Strategy deleted",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StrategyController();
