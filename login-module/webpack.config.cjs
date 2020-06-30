const path = require('path')

module.exports = {
	entry: './src/index.js',
	output: {
		libraryExport: 'default',
		libraryTarget: 'umd',
		library: 'GraphAcademyLogin',
		filename: 'login-prod.js',
		path: path.resolve(__dirname, 'dist'),
	},
}
