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
    historyApiFallback: {
        index:'/stage/index.html'
    },
    proxy: {
        '/stage/sp': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/stage/auth': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/stage/config': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/stage/ua': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/stage/source': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/stage/ba': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/stage/clientConfig': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/stage/monitor': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/stage/github': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/stage/style': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/stage/widgets': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/stage/templates': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/stage/wb': {
            target: 'http://localhost:8088',
            secure: false
        }
    }
}).listen(4000, 'localhost', function (err, result) {
        if (err) {
            return console.log(err);
        }

        console.log('Listening at http://localhost:4000/');
    });
