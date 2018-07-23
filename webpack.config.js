const path = require('path');
const HtmlwebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devServer: {
    compress: true,
    disableHostCheck: true // That solved it
  },
  entry: {
    index: path.join(__dirname, '/examples/index.js')
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '/docs/'),
    chunkFilename: '[id].chunk.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlwebpackPlugin({
      title: 'Full Page'
    })
  ]
};
