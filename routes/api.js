const express = require('express');
const request = require('request').defaults({ encoding: null });
const sha1 = require("sha1");
const path = require("path");

const router = express.Router();

/* POST file by URL (with vulnerability). */
router.post('/load_url', function(req, res) {
  let reqURL = req.body.url;
  let fileName = sha1(reqURL);
  let pathToLoad = path.join(__dirname, '../public/loads');
  let dataToSend = {
    'url': reqURL,
    'pathToLoad': pathToLoad,
    'newFileName': fileName
  }

  /*
  // Code for correction
  if (reqURL.startsWith("file://")) {
    res.status(403);
    res.send("Forbidden operation");
    return;
  }
  */

  request.post('http://127.0.0.1:4000', {json: dataToSend}, function (error, response) {
    if (!error && response.statusCode === 200) {
      res.status(200);
      res.json({path: '/loads/' + fileName});
    } else {
      if (error || response.statusCode === 500) {
        res.status(500);
        res.send("Internal Server Error");
      } else {
        res.status(400);
        res.send("Picture by given URL is unavailable");
      }
    }
  });
});

/* POST local file. */
router.post('/load_local', function(req, res) {
  if (req.file === undefined) {
    res.status(415).send('Unsupported picture type');
    return;
  }
  let picture_path = req.file.path;
  picture_path = picture_path.replace("public", "");
  res.status(200);
  res.json({path: picture_path});
});

module.exports = router;
