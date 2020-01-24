const express = require('express');
const User = require('../models/User');
const router = express.Router();

//register a new user
router.post('/register', async (req, res) =>  {
	const user = new User({
		username: req.body.username,
		password: req.body.password
	});
	try {
		const savedUser = await user.save();
		res.json(savedUser);
	} catch(err) {
		res.json({ message: err});
	}
});


module.exports = router;