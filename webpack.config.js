'use strict';

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');

module.exports = {
    context: path.join(__dirname),
    devtool: 'source-map',
    resolve: {
        modules: ["web_modules", "node_modules", "bower_components"],
        alias: {
            'jquery-ui': 'jquery-ui/ui',
            'jquery': __dirname + "/node_modules/jquery" // Always make sure we take jquery from the same place
        }
    },
    entry: {
        "dev": [
            'webpack-dev-server/client?http://0.0.0.0:4000', // WebpackDevServer host and port
            'webpack/hot/only-dev-server' /// "only" prevents reload on syntax errors
        ],
        "main.bundle": [
            './app/main.js'
        ]
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/stage'
    },

    plugins: [
        new CopyWebpackPlugin([
            { from: 'app/images',
             to: 'app/images'}
        ]),
        new CopyWebpackPlugin([
            { from: 'widgets',
             to: 'widgets'}
        ]),
        new CopyWebpackPlugin([
            { from: 'templates',
                to: 'templates'}
        ]),
        new CopyWebpackPlugin([
            { from: 'userData',
                to: 'userData'}
        ]),
        new HtmlWebpackPlugin({
            template: 'app/index.tmpl.html',
            inject: 'body',
            filename: 'index.html',
            chunks: ["main.bundle"]
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            d3: 'd3'
        })
    ],
    module: {
        rules: [{
            test: /\.js?$/,
            exclude: [/bower_components/, new RegExp('node_modules\\'+path.sep+'(?!d3-format).*'), /cloudify-blueprint-topology/],
            use: [{
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    plugins: ['react-hot-loader/babel'],
                },
            }]
        }, {
            test: /\.scss$/,
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader'
            }, {
                loader: 'sass-loader',

                options: {
                    modules: true,
                    localIdentName: '[name]---[local]---[hash:base64:5]'
                }
            }]
        }, { test: /\.css$/, use: [{
            loader: 'style-loader'
        }, {
            loader: 'css-loader',

            options: {
                importLoaders: 1
            }
        }] }, //{ test: /\.(png|woff|woff2|eot|ttf|svg|jpg)$/, loader: 'url-loader?limit=100000' }
        { test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif)(\?\S*)?$/, use: [{
            loader: 'url-loader',

            options: {
                limit: 100000,
                name: '[name].[ext]'
            }
        }]
        }]
    }
};