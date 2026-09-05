const express = require("express");

const StrategyController = require("../controllers/strategy.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", StrategyController.create);

router.get("/", StrategyController.getUserStrategies);

router.get("/:id", StrategyController.get);

router.post("/:id/analyze", StrategyController.analyze);

router.put("/:id", StrategyController.update);

router.delete("/:id", StrategyController.delete);

module.exports = router;
