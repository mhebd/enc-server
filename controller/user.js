const bcrypt = require('bcryptjs');
const User = require('../model/User');
const {
	asyncHdl,
	errMsg,
	Result,
} = require('../utility');
const crypto = require('node:crypto');
const encrypt = require('../utility/encryption');

/**
	=> @POST
	=> /api/v1/user
	=> Public
*/
exports.createUser = asyncHdl(async (req, res, next) => {
	const { name, email, password } = req.body;

	// Create user
	const user = await User.create({
		name,
		email,
		password,
	});

	// Create token
	const token = await user.getToken();

  // Generate IV for encryption
  const iv = crypto.randomBytes(16);

	// Encrypt user
	const encryptedUser = encrypt(JSON.stringify(user), iv);

	res
		.status(201)
		.json(new Result(true, 'Signup Successful.', { user: encryptedUser, ivHex: iv.toString('hex'), token }));
});

/**
	=> @POST
	=> /api/v1/user
	=> Public
*/
exports.loginUser = asyncHdl(async (req, res, next) => {
	const { email, password } = req.body;

	// Check any fields are not missing
	if (!email || !password) {
		return next(new errMsg('All the fields are required', 400));
	}

	// Check has user
	const user = await User.findOne({ email });
	if (!user) {
		return next(new errMsg('User not found', 404));
	}

	// Verify password
	if (!(await bcrypt.compare(password, user.password))) {
		return next(new errMsg('Email & password did not match', 404));
	}

	// Create token
	const token = await user.getToken();

	// Generate IV for encryption
	const iv = crypto.randomBytes(16);

	// Encrypt user
	const encryptedUser = encrypt(JSON.stringify(user), iv);

	res.status(201).json(new Result(true, 'Login Successful.', { user: encryptedUser, ivHex: iv.toString('hex'), token }));
});

/**
	=> @GET
	=> /api/v1/user
	=> Private
*/
exports.getUser = asyncHdl(async (req, res, next) => {
	const { id } = req.user;
	const user = await User.findById(id).select('-password');

	if (!user) {
		return next(new errMsg('User not found', 404));
	}

	// Generate IV for encryption
	const iv = crypto.randomBytes(16);

	// Encrypt user
	const encryptedUser = encrypt(JSON.stringify(user), iv);

	res.status(200).json(new Result(true, '', { user: encryptedUser, ivHex: iv.toString('hex') }));
});

