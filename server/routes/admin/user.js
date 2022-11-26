const { UserController } = require("../../controllers/UserController");
const { IsAdmin } = require("../../middleware/IsAdmin");
const router = require("express").Router();

router.get(
  "/get-webhotels-for-user",
  IsAdmin,
  UserController.adminGetWebhotelsForUser
);
router.get("/", IsAdmin, UserController.adminGetUsers);
router.post("/delete", IsAdmin, UserController.adminDeleteUsers);

module.exports = router;
