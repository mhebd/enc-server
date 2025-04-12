const mongoose = require('mongoose');

module.exports = () => {
	const STRING = process.env.CON_STRING;
	
	return mongoose.connect(STRING)
		.then(data => console.log('DB Connection Stablish'))
		.catch(err => console.log(err));
};