const { StaffController } = require("../../controllers/StaffController");
const router = require("express").Router();

router.get("/shop", StaffController.browse);
router.post("/shop", StaffController.create);
router.delete("/shop/:id", StaffController.delete);
router.put("/shop/:id", StaffController.update);

module.exports = router;
