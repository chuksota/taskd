const express = require("express");
const app = require("../app");
const router = express.Router();
const { requireAuth } = require("../auth");
const {asyncHandler} = require('./utils')

router.get("/", requireAuth, asyncHandler( async (req, res) => {
  res.render("homepage");
}));

module.exports = router;
