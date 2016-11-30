var webpackConfig = require('webpack-config')

const TARGET = process.env.npm_lifecycle_event


var webpackConfigFile;

switch (TARGET) {  
  case 'start':
    webpackConfigFile = './config/webpack-dev.config.js'
    break
  case 'test':
    webpackConfigFile = './config/webpack.test.js'
    break
  default:
    webpackConfigFile = './config/webpack.prod.js'
    break
}

console.log('TARGET: ' + TARGET);

module.exports = new webpackConfig.Config().extend(webpackConfigFile);
