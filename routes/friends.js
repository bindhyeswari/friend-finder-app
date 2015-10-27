
var router = require('express').Router();
var models = require('../models/models');

// default path will be set to /friends
router.get('/', function (req, res) {
    models.GoogleUserModel.findOne({ userid: req.gmailid }, function (err, result) {
        if (err) res.status(500).json({error: err});
        else res.status(200).json(result.friends);
    });
});

router.put('/', function (req, res) {

   models.GoogleUserModel.findOne({
       userid: req.gmailid
   }, function (err, gmailuser) {
       console.log(gmailuser.friends);

       gmailuser.friends[req.body.email.replace('.', '_')] = req.body;

       console.log(gmailuser.friends);

       gmailuser.save(function (err, result) {
           if (err) res.status(500).json({error: err});
           else res.status(200).json(result);
       });
   });
});

module.exports = router;
