var express = require('express');
var router = express.Router();
// const { requireAuth } = require("../auth");

/* GET home page. */
router.get('/', function(req, res, next) {
  if(res.locals.authenticated){
    return res.render('homepage')
  }else{

    res.render('index', { title: 'taskd' });
  }
});

module.exports = router;
