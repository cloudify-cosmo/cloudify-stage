'use strict';

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
    devtool: 'source-map',
    resolve: {
        alias: {
            'jquery-ui': 'jquery-ui/ui'
        }
    },
    entry: [
        'webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
        'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
        './app/app.js'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'app.bundle.js',
        publicPath: '/'
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: 'app/index.tmpl.html',
            inject: 'body',
            filename: 'index.html'
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
        ,
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            _: "lodash"
        })
    ],
    //eslint: {
    //    configFile: '.eslintrc',
    //    failOnWarning: false,
    //    failOnError: false
    //},
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
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
            { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
        ]
    }
};