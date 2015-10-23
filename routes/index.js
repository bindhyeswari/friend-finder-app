var express = require('express');
var router = express.Router();

function middleware1(req, res, next) {
  console.log(req.user);
  next();
}

router.use(['/test', '/info'], middleware1);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ title: 'Express' });
});

router.get('/test', function(req, res, next) {
  res.json({ title: 'Test' });
});

router.get('/test/info', function(req, res, next) {
  res.json({ title: 'Test Info' });
});

router.get('/info', function(req, res, next) {
  res.json({ title: 'Info' });
});

module.exports = router;
