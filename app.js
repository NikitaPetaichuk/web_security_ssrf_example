const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const multer = require('multer');
const boolParser = require('express-query-boolean');
const sha1 = require('sha1');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const app = express();

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/loads");
  },
  filename: (req, file, cb) => {
    cb(null, sha1(file.originalname));
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({storage: storageConfig, fileFilter: fileFilter}).single("picture"));
app.use(boolParser());

app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
