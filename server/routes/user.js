const { UserController } = require("../controllers/UserController");
const { IsAdmin } = require("../middleware/IsAdmin");
const { IsUser } = require("../middleware/IsUser");
const router = require("express").Router();

router.post("/user/change-password", IsUser, UserController.changePassword);
router.post("/user/save-details", IsUser, UserController.saveUserDetails);
router.post("/user/remove-account", IsUser, UserController.removeAccount);
router.post("/user", IsAdmin, UserController.create);

module.exports = router;
