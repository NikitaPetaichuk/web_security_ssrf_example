const express = require('express');
const request = require('request').defaults({ encoding: null });;
const url = require('url');
const sha1 = require("sha1");
const path = require("path");
const fs = require("fs");

const router = express.Router();

function handleURL(URL, pathToLoad, newFileName, callback) {
  if (URL.startsWith("file://")) {
    let filePath = url.fileURLToPath(URL);
    let copyPath = path.join(pathToLoad, newFileName);
    fs.copyFile(filePath, copyPath, (err) => {
      if (err) callback(500);
      callback(200);
    });
  } else {
    request.get(URL, null, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log(body);
        let buffer = Buffer.from(body);
        fs.writeFile(path.join(pathToLoad, newFileName), buffer, 'binary',(err) => {
          if (err) callback(500);
          callback(200);
        });
      } else {
        if (error) {
          callback(500);
        } else {
          callback(400);
        }
      }
    });
  }
}

/* POST file by URL. */
router.post('/load_url', function(req, res) {
  let reqURL = req.body.url;
  let fileName = sha1(reqURL);
  let pathToLoad = path.join(__dirname, '../public/loads');
  const responseHandler = function (code) {
    res.status(code);
    if (code === 200) {
      res.json({path: '/loads/' + fileName});
    } else {
      res.send("Picture by given URL is unavailable");
    }
  }
  handleURL(reqURL, pathToLoad, fileName, responseHandler);
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
