const Driver = require("../models/driver.model");

/**
 * @class DriverController
 * @description Handles driver-related API endpoints
 */
class DriverController {
  /**
   * @name getAll
   * @description Get all active drivers
   * @access Public
   */
  async getAll(req, res, next) {
    try {
      const drivers = await Driver.find({
        active: true,
      }).sort({ team: 1, name: 1 });

      res.json({
        success: true,
        count: drivers.length,
        data: drivers,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @name getById
   * @description Get driver by ID
   * @access Public
   */
  async getById(req, res, next) {
    try {
      const driver = await Driver.findById(req.params.id);

      if (!driver) {
        return res.status(404).json({
          success: false,
          error: "Driver not found",
        });
      }

      res.json({
        success: true,
        data: driver,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @name getByTeam
   * @description Get drivers belonging to a team
   * @access Public
   */
  async getByTeam(req, res, next) {
    try {
      const drivers = await Driver.find({
        team: req.params.team,
        active: true,
      }).sort({ name: 1 });

      res.json({
        success: true,
        count: drivers.length,
        data: drivers,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @name getActive
   * @description Get all active drivers
   * @access Public
   */
  async getActive(req, res, next) {
    try {
      const drivers = await Driver.find({
        active: true,
        status: "active",
      }).sort({ name: 1 });

      res.json({
        success: true,
        count: drivers.length,
        data: drivers,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DriverController();
