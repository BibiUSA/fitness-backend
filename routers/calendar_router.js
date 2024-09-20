const express = require("express");

const { checkEvent } = require("./../controllers/calendar_controller");
const { addToDate } = require("./../controllers/calendar_controller");
const { removeScheduledPlan } = require("./../controllers/calendar_controller");

const router = express.Router();

router.route("/").get(checkEvent);
router.route("/add").post(addToDate);
router.route("/:plan").delete(removeScheduledPlan);

module.exports = router;
