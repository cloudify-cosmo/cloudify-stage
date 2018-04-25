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
        '/stage/tours': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/stage/wb': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/stage/file': {
            target: 'http://localhost:8088',
            secure: false
        },
        '/stage/plugins': {
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
