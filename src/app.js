const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const fileUpload = require('express-fileupload');
const app = express();
const db = require('./model/connect');

const Route = require('./routes/route')

// sửa lỗi ejs: cors Origin
var cors = require('cors')

const session = require('express-session');
const MongoStore = require('connect-mongo');

// cors
app.use(cors())

// connect database
db.connect();

// express session
app.use(session({
    secret: 'keboard cat',
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/clean_blog' })
}))

// static file
app.use(express.static(path.join(__dirname, 'public')));


app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});


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
