const express = require("express");

const router = express.Router();

router.use(require("./auth"));
router.use(require("./user"));
router.use(require("./billing"));

module.exports = router;
