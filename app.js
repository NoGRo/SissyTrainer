const http = require('http');
const express = require('express');
const path = require('path');
//const favicon = require('serve-favicon');
const jade = require('jade');
//const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'interfaze')));
app.use('/clips',express.static(path.join(__dirname, 'database','clips')));

//app.use('/', index);

app.use('/clipMaker', require('./interfaze/clipMakerController.js'))
app.use('/player', require('./interfaze/playerController.js'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');



});


var port =  3000;
app.set('port', port);

var server = http.createServer(app);

server.listen(port);


module.exports = app;
