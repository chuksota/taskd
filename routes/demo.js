const express = require("express");
const router = express.Router();
const { requireAuth, loginUser } = require("../auth");
const { asyncHandler } = require("./utils");
const db = require("../db/models");

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.render("homepage");
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const demoUser = await db.User.findOne({
      where: { email: "demo@demo.com" },
    });
    loginUser(req, res, demoUser);
    return req.session.save((err) => {
      if (err) {
        next(err);
      } else {
        return res.redirect("/homepage");
      }
    });
  })
);

module.exports = router;
