/**
 * Created by kinneretzin on 29/08/2016.
 */


//var express = require('express');
//var path = require('path');
//var app = express();
//
//var ServerProxy = require('./backend/ServerProxy');
//
//var webpackDevMiddleware = require("webpack-dev-middleware");
//var webpack = require("webpack");
//var config = require('./webpack.config');
//
//app.use('/sp',ServerProxy);
//
//app.use(webpackDevMiddleware(webpack(config), {
//
//    publicPath: config.output.publicPath,
//    stats: { colors: true },
//    index: 'main.html'
//
//}));
//
//
//// BrowserHistory code
//app.get('*',function (request, response){
//    response.sendFile(path.resolve(__dirname, './dist', 'main.html'));
//});
//
//app.listen(3000, function () {
//    console.log('Stage runs on port 3000!');
//});

//
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    inline: true,
    historyApiFallback: true,
    proxy: {
        '/sp': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/config': {
            target: 'http://localhost:8088',
            secure: false
        }
    }
}).listen(3000, 'localhost', function (err, result) {
        if (err) {
            return console.log(err);
        }

        console.log('Listening at http://localhost:3000/');
    });
