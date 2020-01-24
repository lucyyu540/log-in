const express = require('express');
const User = require('../models/User');
//const User = mongoose.model('Users');?????
const router = express.Router();
const mongoose = require('mongoose');
const crypto = require('crypto'), hmac, signature;
const {check, validationResult} = require('express-validator/check');
const {matchedData, sanitize} = require('express-validator/filter')


//register a new user
router.post('/register' [
	check('username')
	.custom(value => {
		return findUserByUsername(value).then(User => {
			//if username alr exists, throw error
		})
	}),
	check('password')
	.isLength({ min : 5}).withMessage('Password must be > 5 characters')
	.matches(/\d/).withMessage('Password must contain at least 1 number')
	.custom((value, {req, loc, path}) => {
		if (value !== req.body.cpassword) {
			//passwords don't match
			throw new Error("Passwords don't match!");
		}
		else {
			return value;
		}
	})

	], async (req, res) =>  {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {//if errors is not empty == errors exist
			res.json({status : "error", message : errors.array()});
		}
		else {
			hmac = crypto.createHmac("sha1", 'auth secret');
			var encpassword = '';
			if (req.body.password) {
				hmac.update(req.body.password);
				encpassword = hmac.digest("hex");
			}
			const user = new User({
				username: req.body.username,
				password: req.body.password,
			});
			try {
				const savedUser = await user.save();
				res.json(savedUser);
			} catch(err) {
				res.json({ message: err});
			}
			/**
			 *  user.save(function(error){
          console.log(user);
          if(error){ 
            throw error;
          }
          res.json({message : "Data saved successfully.", status : "success"});
       });   
			 */

		}


		
	
});

//log in
router.get('/login', async (req, res) =>  {
	try {
		const user = await User.findById();////??????????????
		res.json(savedUser);
	} catch(err) {
		res.json({ message: err});
	}
});

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