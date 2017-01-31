'use strict';

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');

module.exports = {
    context: path.join(__dirname),
    devtool: 'source-map',
    resolve: {
        modulesDirectories: ["web_modules", "node_modules", "bower_components"],
        fallback: __dirname + "/node_modules",
        alias: {
            'jquery-ui': 'jquery-ui/ui',
            'jquery': __dirname + "/node_modules/jquery" // Always make sure we take jquery from the same place
        }
    },
    entry: {
        "dev": [
            'webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
            'webpack/hot/only-dev-server' /// "only" prevents reload on syntax errors
        ],
        "main.bundle": [
            './app/main.js'
        ]
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/'
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
            { from: 'conf',
                to: 'conf'}
        ]),
        new CopyWebpackPlugin([
            { from: 'logs',
                to: 'logs'}
        ]),
        new HtmlWebpackPlugin({
            template: 'app/index.tmpl.html',
            inject: 'body',
            filename: 'index.html',
            chunks: ["main.bundle"]
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
        ,
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])
        ),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            d3: 'd3'
        })
    ],
    //eslint: {
    //    configFile: '.eslintrc',
    //    failOnWarning: false,
    //    failOnError: false
    //},
    resolveLoader: { fallback: __dirname + "/node_modules" },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: [/bower_components/, /node_modules/,/cloudify-blueprint-topology/],
                loaders: ['react-hot','babel']
            },
            {
                test: /\.json?$/,
                loader: 'json'
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass?modules&localIdentName=[name]---[local]---[hash:base64:5]'
            },
            { test: /\.css$/, loader: "style-loader!css-loader?importLoaders=1" },
            //{ test: /\.(png|woff|woff2|eot|ttf|svg|jpg)$/, loader: 'url-loader?limit=100000' },
            //{ test: /.(png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/, loader: 'url-loader?limit=100000' }
            { test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif)(\?\S*)?$/
                , loader: 'url-loader?limit=100000&name=[name].[ext]'
            }
        ]
    }
};