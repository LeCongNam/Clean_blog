const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const db = require('./model/connect');
require('dotenv').config()
const app = express();



// connect database
db.connect();


const fileUpload = require('express-fileupload');
const Route = require('./routes/route')
const session = require('express-session');
const MongoStore = require('connect-mongo');

// express session
app.use(session({
    secret: 'keboard cat',
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/clean_blog' })
}))

// static file
app.use(express.static(path.join(__dirname, 'public')));




// File upload
app.use(fileUpload());

// view engine setup
app.set('views', path.join(__dirname, 'resource', 'views'));
app.set('view engine', 'ejs');


// logger
app.use(logger('dev'));

// end code url 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// khởi tạo route => /route/index.js
Route(app)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
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

module.exports = app;
