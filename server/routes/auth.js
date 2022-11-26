const { AuthController } = require("../controllers/AuthController");
const router = require("express").Router();

router.get("/auth/init", AuthController.init);
router.post("/auth/login", AuthController.login);
router.post("/auth/register", AuthController.register);

module.exports = router;
