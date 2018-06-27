/**
 * Created by kinneretzin on 29/08/2016.
 */

const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');

const webpackConfig = require('./webpack.config');
const config = require('./backend/config').get();

const contextPath = config.app.contextPath;

const host = 'localhost';
const devServerPort = 4000;

const proxyPort = 8088;
const proxyTarget = `http://${host}:${proxyPort}`;

const proxyOptions = {
    target: proxyTarget,
    secure: false
};

const indexHtml = `${contextPath}/index.html`
const options = {
    publicPath: webpackConfig[0].output.publicPath,
    hot: true,
    host: host,
    inline: true,
    historyApiFallback: {
        index: indexHtml
    },
    proxy: {
        [`${contextPath}/sp`]: proxyOptions,
        [`${contextPath}/auth`]: proxyOptions,
        [`${contextPath}/config`]: proxyOptions,
        [`${contextPath}/ua`]: proxyOptions,
        [`${contextPath}/source`]: proxyOptions,
        [`${contextPath}/ba`]: proxyOptions,
        [`${contextPath}/clientConfig`]: proxyOptions,
        [`${contextPath}/monitor`]: proxyOptions,
        [`${contextPath}/github`]: proxyOptions,
        [`${contextPath}/external`]: proxyOptions,
        [`${contextPath}/style`]: proxyOptions,
        [`${contextPath}/widgets`]: proxyOptions,
        [`${contextPath}/templates`]: proxyOptions,
        [`${contextPath}/tours`]: proxyOptions,
        [`${contextPath}/wb`]: proxyOptions,
        [`${contextPath}/file`]: proxyOptions,
        [`${contextPath}/plugins`]: proxyOptions
    }
};

webpackDevServer.addDevServerEntrypoints(webpackConfig[0], options);
const compiler = webpack(webpackConfig);
const server = new webpackDevServer(compiler, options);

server.listen(devServerPort, host, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log(`Listening at http://${host}:${devServerPort}/`);
});
