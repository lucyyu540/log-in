const mongoose = require('mongoose');
//creating schema
const userSchema = mongoose.Schema({
	username :  {
		type: String,
		required: true
	},
	password : {
		type: String,
		required: true
	},
	firstName: {
		type: String,
		required: false
	},
	middleName: {
		type: String,
		required: false
	},
	lastName: {
		type: String,
		required: false
	},
	shopping : [String]
});

module.exports = mongoose.model('Users', userSchema);