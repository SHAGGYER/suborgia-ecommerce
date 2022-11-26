const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/users", require("./user"));
router.use("/settings", require("./settings"));
router.use("/plan", require("./plan"));
router.use("/staff", require("./staff"));
router.use("/installation", require("./installation"));

module.exports = router;
