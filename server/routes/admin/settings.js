const {SettingsController} = require("../../controllers/SettingsController");
const router = require("express").Router();

router.put("/", SettingsController.updateSettings);

module.exports = router;