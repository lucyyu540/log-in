const mongoose = require('mongoose');
//creating schema
var userSchema = mongoose.Schema({
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
	spendings: [{
		amount : {
			type: Number,
			required: true
		},
		date: {
				type: Date,
				default: Date.now
		},
		tag: {
			type: String,
			required: false}
		}],
	earnings: [{
				amount : {
					type: Number,
					required: true
				},
				date: {
						type: Date,
						default: Date.now
				},
				tag: {
					type: String,
					required: false}
				}],
	spendingTags: [String],
	earningTags: [String],
	days: {type: Number,},
});

module.exports = mongoose.model('User', userSchema);