const express = require("express");
const DriverController = require("../controllers/driver.controller");

const router = express.Router();

/**
 * @route GET /api/v1/drivers
 * @description Get all active drivers
 * @access Public
 */
router.get("/", DriverController.getAll);

/**
 * @route GET /api/v1/drivers/active
 * @description Get active drivers
 * @access Public
 */
router.get("/active", DriverController.getActive);

/**
 * @route GET /api/v1/drivers/team/:team
 * @description Get drivers by team
 * @access Public
 */
router.get("/team/:team", DriverController.getByTeam);

/**
 * @route GET /api/v1/drivers/:id
 * @description Get driver by ID
 * @access Public
 */
router.get("/:id", DriverController.getById);

module.exports = router;
