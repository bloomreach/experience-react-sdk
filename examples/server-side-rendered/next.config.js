const dotenv = require('dotenv').config();

if (dotenv.error) {
  throw dotenv.error;
}

module.exports = {
  assetPrefix: process.env.PUBLIC_URL || '/',
};
