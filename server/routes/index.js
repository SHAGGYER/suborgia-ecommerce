const path = require("path");
const express = require("express");

const router = express.Router();

router.use("/api/admin/", require("./admin"));
router.use("/api/", require("./api"));

router.use("/barber", express.static(path.join(__dirname, "../../barber/dist")));
router.get("/barber/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../barber/dist/index.html"));
});

router.use("/", express.static(path.join(__dirname, "../../client/dist")));
router.get("/*", (_, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

module.exports = router;
