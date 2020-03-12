//loading dependencies
const express = require('express');
const User = require('../models/User');
const crypto = require('crypto'); //hmac, signature;
const { check, validationResult } = require("express-validator");//middleware btw frontend request and backend processor
const {matchedData, sanitize} = require('express-validator');
const passport = require('../config/passport')
var path = require('path');
const usersRoute = require('../routes/users');
const jwt = require('jsonwebtoken');//token
require('dotenv').config();


const router = express.Router();
router.use(express.static(path.join(__dirname, '../public/build')));
router.use(express.static(path.join(__dirname, '../public')));
router.use('/users', usersRoute);



const algor = "sha1";
const key = 'auth secret';


//register a new user
router.post('/register',
	[check('username')
	.custom(value => {
		return findUserByUsername(value).then(User => {

		})
	}),
	
	check('password')
	.isLength({ min : 5}).withMessage('Password must be at least 5 characters')	
	.custom((value, {req, loc, path}) => {
		if (value !== req.body.cpassword) {
			//passwords don't match
			throw new Error("Passwords don't match!"); //loading to validationResult
		}
		else {
			return value;
		}
	})]
	, async (req, res) =>  {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {//if errors exist
			res.json({status : "error", message : errors.array()});//display errors
		}//discontinue
		else {
			//encrypting password
			const hmac = crypto.createHmac(algor, key);
			var encpassword = '';
			if (req.body.password) {
				hmac.update(req.body.password);
				encpassword = hmac.digest("hex");
			}
			const user = new User({
				username: req.body.username,
				password: encpassword,
			});
			//saving new user
			try {
				const savedUser = await user.save();
				res.json({status : 'success', message : 'Succesfully registered user!'});
			} catch(err) {
				res.json({ message: err});
			}
		}
});

router.post('/login', async (req, res) =>  {	
		//can't be blank
		if (!req.body.username) {
			return res.json({status : 'error', message: 'Username cannot be blank.'});
		}
		if (!req.body.password) {
			return res.json({status : 'error', message: 'Password cannot be blank.'});
		}
		//encrypt given password
		var encpassword = '';
		if (req.body.password) {
			const hmac = crypto.createHmac(algor, key);
			hmac.update(req.body.password);
			encpassword = hmac.digest("hex");
		}
		const username = req.body.username;
		const password = encpassword;

		//check username and password
		try {
			const user = await User.findOne({username: username});
			if(user.password != password) {
				return res.json({status: 'error', message : 'Incorrect password.'});
			}
			//redirect url
			const url = '/users/'+username;
			/** 
			req.session.user = user; //store to session
			req.session.save(function(err) {//save
				if(err) {
				  res.end('session save error: ' + err)
				  return
				}
			
			return res.json({status: 'success', redirect: url});
			})*/

			//generating a token and sending to client
			jwt.sign({user: user}, process.env.ACCESS_TOKEN_SECRET, (err, token) => {
				console.log('/login: sending token');
				const cookieOptions = {
					httpOnly: true,
					expires: 0 
				   };
				res.cookie('token', token, cookieOptions);
				//res.redirect(url);
				res.json({status: 'success', redirect: url});
			});
		}
		catch (err) {
			res.json({status: 'error', message: 'Invalid username.'});
		}
		
});


function findUserByUsername(username) {
	if(username) {
		return new Promise((resolve, reject) => {
			User.findOne({username: username})
			.exec((err, doc) => {
				if (err) return reject(err)
				if (doc) return reject(new Error ('This username is taken. Please enter another username.'))
				else return resolve(username)
			})
		})
	}
}

module.exports = router;