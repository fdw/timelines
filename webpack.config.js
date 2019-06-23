const path = require('path')
const MergeJsonWebpackPlugin = require('merge-jsons-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'docs')
  },
  devtool: 'source-map',
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
    })
  ]
}
