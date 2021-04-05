const express = require('express');
const router = express.Router();
const db = require('../db/models')
const bcrypt = require('bcryptjs')
const {asyncHandler, csrfProtection} = require('./utils')


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
