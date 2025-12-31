import mongoose from 'mongoose';
import validator from 'validator';
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please provide a name'],
	},
	email: {
		type: String,
		required: [true, 'Please provide an email'],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, 'Please provide a valid email'],
	},
	password: {
		type: String,
		required: [true, 'Please provide a password'],
		min: 10,
	},
	passwordConfirm: {
		type: String,
		required: [true, 'Please provide confirm password'],
		validate: {
			validator: function (passwordConfirm) {
				return passwordConfirm === this.password;
			},
			message: 'password do not match!',
		},
	},

	passwordChangeAt: Date,
	role: {
		type: String,
		enum: ['admin', 'user'],
		default: 'user',
	},
});

const User = mongoose.model('User', userSchema);

export default User;

// Authentication

//1. Authentication ::
//2. Authorization ::
