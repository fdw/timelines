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
      minSize: 0,
      cacheGroups: {
        data: {
          test: /\.json$/,
          filename: '[name].js',
          name(module) {
            const filename = module.rawRequest.replace(/^.*[\\/]/, '');
            return filename.substring(0, filename.lastIndexOf('.'));
          },
        }
      }
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
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /a^/),
    new HtmlWebpackPlugin({
      template: "src/timelines.html",
      inject: 'body',
      filename: "timelines.html"
    })
  ]
}
