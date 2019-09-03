const dotenv = require('dotenv').config();
const webpack = require('webpack');

if (dotenv.error) {
  throw dotenv.error;
}

module.exports = {
  assetPrefix: process.env.PUBLIC_URL || '/',
  webpack(config) {
    const { parsed: localEnv } = dotenv;
    config.plugins.push(new webpack.EnvironmentPlugin(localEnv));
    return config
  }
};
