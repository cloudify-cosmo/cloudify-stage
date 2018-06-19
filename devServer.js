/**
 * Created by kinneretzin on 29/08/2016.
 */

const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');

const config = require('./webpack.config');
const options = {
    publicPath: config[0].output.publicPath,
    hot: true,
    host: 'localhost',
    inline: true,
    historyApiFallback: {
        index:'/console/index.html'
    },
    proxy: {
        '/console/sp': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/console/auth': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/console/config': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/console/ua': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/console/source': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/console/ba': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/console/clientConfig': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/console/monitor': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/console/github': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/console/style': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/console/widgets': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/console/templates': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/console/tours': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/console/wb': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/console/file': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/console/plugins': {
            target: 'http://localhost:8088',
            secure: false
        }
    }
};

webpackDevServer.addDevServerEntrypoints(config[0], options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

server.listen(4000, 'localhost', (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Listening at http://localhost:4000/');
});
