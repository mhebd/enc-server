const express = require('express');

const { privateRoute } = require('../middleware/auth');
const { 
	createUser, 
	loginUser, 
	getUser } = require('../controller/user');
const router = express.Router();

router.route('/').get(privateRoute, getUser);
router.route('/signup').post(createUser);
router.route('/login').post(loginUser);


module.exports = router;