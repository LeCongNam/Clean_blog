const indexRouter = require('./index');
const usersRouter = require('./users');
const authorRouter = require('./author');

function Route(app){
	app.use('*', function (req, res, next) {
		res.locals.userId = req.session.userId
		next()
	});

	app.use('/author', authorRouter);
	app.use('/users', usersRouter);
	app.use('/', indexRouter);

}

module.exports = Route;



