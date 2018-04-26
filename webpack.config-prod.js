'use strict';

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var path = require('path');

module.exports = {
    mode: 'production',
    context: path.join(__dirname),
    devtool: 'source-map',
    resolve: {
        modules: ['web_modules', 'node_modules', 'bower_components'],
        alias: {
            'jquery-ui': 'jquery-ui/ui',
            'jquery': __dirname + '/node_modules/jquery' // Always make sure we take jquery from the same place
        }
    },
    entry: [
        './app/main.js'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'app.bundle.js',
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
            { from: 'tours',
                to: 'tours'}
        ]),
        new HtmlWebpackPlugin({
            template: 'app/index.tmpl.html',
            inject: 'body',
            filename: 'index.html'
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            d3: 'd3'
        }),
        new UglifyJsPlugin({
            include: 'app.bundle.js',
            sourceMap: true,
            parallel: true,
            extractComments: true
        })
    ],

    optimization: {
        noEmitOnErrors: true
    },

    module: {
        rules: [{
            test: /\.js?$/,
            exclude: [/bower_components/, new RegExp('node_modules\\'+path.sep+'(?!d3-format).*'), /cloudify-blueprint-topology/],
            use: [{
                loader: 'babel-loader'
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