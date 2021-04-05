const express = require("express");
const app = require("../app");
const router = express.Router();
const { requireAuth } = require("../auth");

router.get("/", requireAuth, (req, res) => {
  res.render("homepage");
});

module.exports = router;
