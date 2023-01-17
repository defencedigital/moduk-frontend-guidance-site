/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('node:path')

const config = {
  context: path.resolve(__dirname),
  devtool: 'source-map',
  entry: './src/site/index.ts',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(m?js|ts)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.mjs', '...'],
  },
}

module.exports = config
