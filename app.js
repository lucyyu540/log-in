//dependencies
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });
//require('dotenv/config');
const bodyParser = require('body-parser');//access req.body
const userRoute = require('./routes/users');//import route
const indexRoute = require('./routes/index');
const path = require('path');
//const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');



//execute express
const app = express(); 

//middleware
app.use(cors());
app.use('/users/', userRoute);
app.use('/', indexRoute);
app.use('/', bodyParser.json());
app.use('/', bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));//connecting files


//routes


//connect to DB
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_CONNECTION, 
	{ useNewUrlParser: true , useUnifiedTopology: true})
	.then(res => console.log('*successfully connected to db*'))
	.catch(err => console.log(err))



//listening
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${ port }`));

