const express = require("express");
const RaceController = require("../controllers/race.controller");

const router = express.Router();

/**
 * @route GET /api/v1/races
 * @description Get all races
 * @access Public
 */
router.get("/", RaceController.getAll);

/**
 * @route GET /api/v1/races/upcoming
 * @description Get upcoming races
 * @access Public
 */
router.get("/upcoming", RaceController.getUpcoming);

/**
 * @route GET /api/v1/races/season/:season
 * @description Get races for a season
 * @access Public
 */
router.get("/season/:season", RaceController.getBySeason);

/**
 * @route GET /api/v1/races/status/:status
 * @description Get races by status
 * @access Public
 */
router.get("/status/:status", RaceController.getByStatus);

/**
 * @route GET /api/v1/races/:id
 * @description Get race by ID
 * @access Public
 */
router.get("/:id", RaceController.getById);

module.exports = router;
