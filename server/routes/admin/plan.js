const {PlanController} = require("../../controllers/PlanController");
const router = require("express").Router();

router.post("/", PlanController.create);
router.get("/", PlanController.find);
router.put("/:id", PlanController.update);

module.exports = router;