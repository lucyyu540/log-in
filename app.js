//dependencies
//routes
const userRoute = require('./routes/users');
const indexRoute = require('./routes/index');
const express = require('express');
var app = express(); 

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });//config username and password hiding
const bodyParser = require('body-parser');//access req.body
const cors = require('cors');//handle cross domain requests

const path = require('path');
var logger = require('morgan');//logger

const cookieParser = require('cookie-parser');
const session = require('express-session');
const serveStatic = require('serve-static');
const passport = require('passport');//login authentication

app.use(express.static(path.join(__dirname, 'public/build')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'models')));
app.use(express.static(path.join(__dirname, 'public/fonts')));

app.use(logger('dev'));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/** passport setup */

app.use(cookieParser());
app.use(session({ secret: 'keyboard cat', 
				resave: false, 
				saveUninitialized: true ,
				cookie: { secure: false } 
				})
		);
app.use(passport.initialize());
app.use(passport.session());

/**ROUTES */
app.use('/users', checkSignIn, userRoute);
app.use('/', indexRoute);


/**ERROR */
function checkSignIn(req, res, next) {
    if(typeof req.session.user == undefined) {
		console.log('not authorized redirecting to log-in page');
		res.redirect('/');
		return;
	}
    next();
}

app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
  });
// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
});


//connect to DB
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_CONNECTION, 
	{ useNewUrlParser: true , useUnifiedTopology: true})
	.then(res => console.log('*successfully connected to db*'))
	.catch(err => console.log(err))



module.exports = app;