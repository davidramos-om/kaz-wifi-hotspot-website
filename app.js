var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var portalRouter = require('./api/portal');
var contactRouter = require('./api/contact');
var appVersionRouter = require('./api/version');
var hotspotTemplatesRouter = require('./api/hotspot-templates');
var dbReconectRouter = require('./api/db');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/images')));

app.use('/', indexRouter);
app.use(usersRouter);
app.use(portalRouter);
app.use(contactRouter);
app.use(appVersionRouter);
app.use(hotspotTemplatesRouter);
app.use(dbReconectRouter);

app.use(function (req, res, next) {
  next(createError(404));
});


app.get('*', function (req, res) {
  res.send('Este enlace no existe', 404);
});

app.use(function (err, req, res, next) {

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
