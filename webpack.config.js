const webpack = require('webpack');
const path = require('path');
const MergeJsonWebpackPlugin = require('merge-jsons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/timelines.ts',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'docs'),
  },
  devtool: 'source-map',
  resolve: {
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  },
  module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader'
        },
        {
          test: /\.js$/,
          loader: 'source-map-loader'
        }
      ]
  },
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: 'all',
      minSize: 0
    }
  },
  plugins: [
    new MergeJsonWebpackPlugin({
      'output': {
        'groupBy': [
          {
            'pattern': 'data/*.json',
            'fileName': 'data.json'
          }
        ]
      }
    }),
    new HtmlWebpackPlugin({
      template: "src/timelines.html",
      inject: 'body',
      filename: "timelines.html"
    })
  ]
}
