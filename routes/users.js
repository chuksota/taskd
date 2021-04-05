const express = require('express');
const router = express.Router();
const db = require('../db/models')
const bcrypt = require('bcryptjs')
const {asyncHandler, csrfProtection} = require('./utils')
const {check, validationResult} = require('express-validator')

/* GET users listing. */
router.get('/signup', csrfProtection, function(req, res, next) {
  const user = db.User.build()
  res.render('signup', {title: 'Sign Up', csrfToken: req.csrfToken(), user})
});

module.exports = router;
