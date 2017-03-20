/**
 * Created by kinneretzin on 29/08/2016.
 */

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
        },
        '/ua': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/source': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/blueprints': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/clientConfig': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/monitor': {
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
