const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bloomreach-experience-react-sdk.js',
    globalObject: 'this',
    library: 'BloomreachReactSdk',
    libraryTarget: 'umd'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
  ],
  externals: {
    'react': {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React',
      root: 'React'
    }
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules|examples/,
        use: 'babel-loader'
      }
    ]
  },
}