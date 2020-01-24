const express = require('express');
const User = require('../models/User');
//const mongoose = require('mongoose');
//const User = mongoose.model('Users');
const router = express.Router();
const crypto = require('crypto'); //hmac, signature;
const { check, validationResult } = require("express-validator");
const bodyParser = require('body-parser');
const {matchedData, sanitize} = require('express-validator');


router.use(bodyParser.json());
//check --> middleware btw frontend request and backend processor



//register a new user
router.post('/register',
	[check('username')
	.custom( async value => {
		try {
			const user = await findUserByUsername(value);
			throw new Error("User with this username already exists");	
		} catch(err) {
			//not found = free to take
		}
	}),
	
	check('password')
	.isLength({ min : 5}).withMessage('Password must be at least 5 characters')	
	.custom((value, {req, loc, path}) => {
		if (value !== req.body.cpassword) {
			//passwords don't match
			throw new Error("Passwords don't match!");
		}
		else {
			return value;
		}
	})]
	, async (req, res) =>  {
		console.log(req.body);
		const errors = validationResult(req);
		if (!errors.isEmpty()) {//if errors is not empty == errors exist
			res.json({status : "error", message : errors.array()});
		}
		else {
			const hmac = crypto.createHmac("sha1", 'auth secret');
			var encpassword = '';
			if (req.body.password) {
				hmac.update(req.body.password);
				encpassword = hmac.digest("hex");
			}
			const user = new User({
				username: req.body.username,
				password: encpassword,
			});
			try {
				const savedUser = await user.save();
				console.log(user);
				res.json({status : 'success', message : 'Succesfully registered user!'});
			} catch(err) {
				res.json({ message: err});
			}
		}
});

/** 
//log in
router.get('/login', async (req, res) =>  {
	try {
		const user = await User.findById();////??????????????
		res.json(savedUser);
	} catch(err) {
		res.json({ message: err});
	}
});
*/

function findUserByUsername(username) {
	if(username) {
		return new Promise((resolve, reject) => {
			User.findOne({username: username})
			.exec((err, doc) => {
				if (err) return reject(err)
				if (doc) return reject(new Error ('This username is taken'))
				else return resolve(username)
			})
		})
	}
}
module.exports = router;