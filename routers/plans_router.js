const express = require("express");
const { plans, removePlan } = require("./../controllers/plans_controller");
const { getPlans } = require("./../controllers/plans_controller");
const { dayPlan } = require("./../controllers/plans_controller");

const router = express.Router();

// const obj =  {
//    get: function(middleware){

//    }
// }

router.route("/").post(plans);
router.route("/").get(getPlans);
router.route("/:plan").delete(removePlan);
router.route("/datePlan/").post(dayPlan);

module.exports = router; /// default export system
