const path = require('path');
//const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const Webpack = require('webpack');

module.exports = {
    entry: './src/index.ts',
    output: {
      //path: path.resolve(__dirname, 'dist'),
      filename: './app.bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          enforce: "pre",
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
            use: [
            'style-loader',
            'css-loader'
          ]
        }
      ]   
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new Webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
      //contentBase: './dist',
      contentBase: path.join(__dirname, "./"),
      compress: true,
      hot: true,
      port: 3000
    },
    devtool: "inline-source-map",
    resolve: {
      extensions: [ ".tsx", ".ts", ".js" ]
    },
    externals: {
      //"pixi": "PIXI"
    }
  }