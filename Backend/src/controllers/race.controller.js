const Race = require("../models/race.model");

/**
 * @class RaceController
 * @description Handles race-related API endpoints
 */
class RaceController {
  /**
   * @name getAll
   * @description Get all races
   * @access Public
   */
  async getAll(req, res, next) {
    try {
      const races = await Race.find()
        .populate("circuit")
        .sort({ season: 1, round: 1 });

      res.json({
        success: true,
        count: races.length,
        data: races,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @name getById
   * @description Get single race by ID
   * @access Public
   */
  async getById(req, res, next) {
    try {
      const race = await Race.findById(req.params.id).populate("circuit");

      if (!race) {
        return res.status(404).json({
          success: false,
          error: "Race not found",
        });
      }

      res.json({
        success: true,
        data: race,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @name getUpcoming
   * @description Get upcoming races
   * @access Public
   */
  async getUpcoming(req, res, next) {
    try {
      const races = await Race.find({
        status: "upcoming",
      })
        .populate("circuit")
        .sort({ date: 1 });

      res.json({
        success: true,
        count: races.length,
        data: races,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @name getBySeason
   * @description Get races for a specific season
   * @access Public
   */
  async getBySeason(req, res, next) {
    try {
      const season = Number(req.params.season);

      if (!Number.isInteger(season)) {
        return res.status(400).json({
          success: false,
          error: "Invalid season",
        });
      }

      const races = await Race.find({
        season,
      })
        .populate("circuit")
        .sort({ round: 1 });

      res.json({
        success: true,
        count: races.length,
        data: races,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @name getByStatus
   * @description Get races filtered by status
   * @access Public
   */
  async getByStatus(req, res, next) {
    try {
      const allowedStatuses = ["upcoming", "live", "completed", "cancelled"];

      const { status } = req.params;

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: `Invalid race status. Allowed values: ${allowedStatuses.join(
            ", ",
          )}`,
        });
      }

      const races = await Race.find({
        status,
      })
        .populate("circuit")
        .sort({ date: 1 });

      res.json({
        success: true,
        count: races.length,
        data: races,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RaceController();
