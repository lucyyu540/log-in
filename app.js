//dependencies
const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config');//to hide username and password
const bodyParser = require('body-parser');//access req.body
const userRoute = require('./routes/users');//import route
const indexRoute = require('./routes/index');
const path = require('path'); 

//execute express
const app = express(); 

//middleware
app.use('/users/', userRoute);
app.use('/', indexRoute);
app.use(bodyParser.json());
app.use(express.static('public'));//connecting to jquery files


//connect to DB
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_CONNECTION, 
	{ useNewUrlParser: true , useUnifiedTopology: true})
	.then(res => console.log('*successfully connected to db*'))
	.catch(err => console.log(err))



//listening
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${ port }`));

