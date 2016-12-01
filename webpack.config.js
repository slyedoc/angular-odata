var webpackConfig = require('webpack-config');

var webpackConfigFile = './config/webpack.test.js';

module.exports = new webpackConfig.Config().extend(webpackConfigFile);
