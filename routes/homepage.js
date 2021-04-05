const express = require("express");
const router = express.Router();
const { requireAuth } = require("../auth");
const {asyncHandler} = require('./utils')
const db = require("../db/models");

router.get("/", requireAuth, asyncHandler( async (req, res) => {
  res.render("homepage");
}));

router.get("/demo", asyncHandler(async (req, res) => {
  res.render("homepage");
}));

module.exports = router;
