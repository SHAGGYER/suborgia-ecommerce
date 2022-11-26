const {
  InstallationController,
} = require("../../controllers/InstallationController");
const router = require("express").Router();

router.post("/app-name", InstallationController.saveAppName);
router.post("/admin-account", InstallationController.saveAdminAccount);

module.exports = router;
