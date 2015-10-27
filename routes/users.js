var express = require('express');
var router = express.Router();
var models = require('../models/models');
var friends = require('./friends');

router.use('/:id/friends', function (req, res, next) {
  req.gmailid = req.params.id;
  next();
}, friends);

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  console.log(req.params.id);

  models.GoogleUserModel.find({ userid: req.params.id }, function (err, result) {
      if (err) res.status(500).json({error: err});
      else res.status(200).json({result: result});
  })

});

module.exports = router;
