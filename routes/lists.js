const express = require("express");
const router = express.Router();
const db = require("../db/models");
const { asyncHandler, csrfProtection } = require("./utils");
const { check, validationResult } = require("express-validator");



router.get('/', asyncHandler(async(req, res)=>{
  const {userId} = req.session.auth
  const lists = await db.List.findAll({where: {userId}})
  res.json({lists})
}))



module.exports = router
