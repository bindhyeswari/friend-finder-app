var express = require('express');
var router = express.Router();
var models = require('../models/models');

router.use(function (req, res, next) {
  if (req.user) next();
  else {
    res.status(401).json({ message: 'You need to be authenticated to see the information ... ' });
  }
});


// implement an access control list



/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.user) {
    res.status(200).json({user: req.user});

    // save the person to mongodb

    (new models.GoogleUserModel({
      userid: req.user.id,
      profile: req.user
    })).save(function (err, result) {
          if (err) console.log('Something broke! Could not save ', req.user.displayName);
          else console.log('Saved the user ', req.user.id, ' successfully ... ');
        });

  } else {
    res.status(401).json({message: 'unauthorized access ... '});
  }
});

router.get('/users', function (req, res) {
  models.GoogleUserModel.find(function (err, result) {
    if (err) res.status(500).json({ message: 'something broke .... '});
    else res.status(200).json(result);
  });
});

router.get('/validate', function (req, res) {
   res.status(200).json(req.user);
});

router.post('/position', function (req, res) {
   // get the information from the front end and store to the back end ...
  console.log(req.body);
  req.body.timestamp = new Date();

  (new models.PositionModel(req.body)).save(function (err, result) {
      if (err) res.status(500).json({error: err});
      else res.status(201).json({result: result});
  });

});


module.exports = router;
