var express = require('express');
var router = express.Router();

var variables = require('../util/variables');
var print = require('../util/print');
var dataHelper = require('../db/datahelper');

var model_lic_demo = require('../db/model/demo');
const uuidv1 = require('uuid/v1');
const uuidv3 = require('uuid/v3');
const uuidv4 = require('uuid/v4');


router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});



module.exports = router;