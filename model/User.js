const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, "User Name is a required field."],
		minLength: [4, "User Name is too short. You should provide at least 4 character."],
		maxLength: 20,
		trim: true,
	},
	email: {
		type: String,
		required: [true, "User Email is a required field."],
		unique: [true, "User with this email is already exist."],
		trim: true,
		lower: true,
		validate: {
      validator: (email) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email),
      message: "Please enter a valid email"
	  },
	},
	password: {
		type: String,
		required: [true, "User password is a required field."],
		minLength: [6, "User password is too short. You should provide at least 6 character."],
		maxLength: [16, "User password is too long. You should provide under 16 character."],
	},
	type: {
		type: String,
		enum: ['user'],
		default: 'user',
	},
})

userSchema.pre('save', async function(next) {
	this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.getToken = async function() {
	const token = await jwt.sign({
		id: this._id,
		email: this.email,
		name: this.name,
		type: this.type
	}, process.env.SECRET_KEY, { expiresIn: process.env.EXPIRES_IN});

	return token;
};

const User = mongoose.model('User', userSchema);
module.exports = User;	