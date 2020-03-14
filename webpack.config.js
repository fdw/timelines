const webpack = require('webpack');
const path = require('path')
const MergeJsonWebpackPlugin = require('merge-jsons-webpack-plugin')

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'docs')
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
    usedExports: true
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
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /a^/)
  ]
}
