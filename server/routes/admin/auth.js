const { AuthController } = require("../../controllers/AuthController");
const { IsAdmin } = require("../../middleware/IsAdmin");
const router = require("express").Router();

router.get("/init", AuthController.initAdmin);
router.post("/login", AuthController.loginAdmin);
router.post("/login-as-user", IsAdmin, AuthController.loginAdminAsUser);
router.post("/log", AuthController.log);

module.exports = router;
