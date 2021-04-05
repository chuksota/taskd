const express = require('express');
const router = express.Router();
const db = require('../db/models')
const bcrypt = require('bcryptjs')
const {asyncHandler, csrfProtection} = require('./utils')
const {check, validationResult} = require('express-validator')

/* GET users listing. */
router.get('/users/signup', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
