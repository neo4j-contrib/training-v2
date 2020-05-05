const path = require('path');

module.exports = {
	entry: './login-new.js',
	output: {
		filename: 'login-prod.js',
		path: path.resolve(__dirname, 'dist'),
	},
};