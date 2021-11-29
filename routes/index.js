const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  let correctFlag = req.query.correct || false;
  res.render('index', {layout:false, correctFlag: correctFlag});
});

module.exports = router;
