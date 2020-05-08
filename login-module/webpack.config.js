const path = require('path')

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  output: {
    filename: 'login-prod.js',
    path: path.resolve(__dirname, 'dist')
  }
}
