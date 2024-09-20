const express = require("express");
const {
  loggingIn,
  protect,
  userInformation,
  autoLogin,
  deleteAllPlans,
  deleteAccount,
  addName,
} = require("./../controllers/account_controller");

const router = express.Router();

router.route("/").post(loggingIn);
router.route("/protect").post(autoLogin);
router.route("/user/information").get(protect, userInformation);
router.route("/:email").delete(deleteAllPlans);
router.route("/remove/:email").delete(deleteAccount);
router.route("/addName").post(addName);

module.exports = router;
