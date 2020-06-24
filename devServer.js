/**
 * Created by kinneretzin on 29/08/2016.
 */

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const webpackConfig = require('./webpack.config');
const Consts = require('./backend/consts');
const startWidgetBackendWatcher = require('./scripts/widgetBackendWatcher');

const host = 'localhost';
const devServerPort = 4000;

const proxyPort = 8088;
const proxyTarget = `http://${host}:${proxyPort}`;
const contextPath = Consts.CONTEXT_PATH;

const proxyOptions = {
    target: proxyTarget,
    secure: false
};

const indexHtml = `${contextPath}/static/index.html`;
const options = {
    publicPath: webpackConfig[0].output.publicPath,
    host,
    inline: false,
    historyApiFallback: {
        index: indexHtml
    },
    proxy: {
        [`${contextPath}/auth`]: proxyOptions,
        [`${contextPath}/ba`]: proxyOptions,
        [`${contextPath}/clientConfig`]: proxyOptions,
        [`${contextPath}/config`]: proxyOptions,
        [`${contextPath}/external`]: proxyOptions,
        [`${contextPath}/file`]: proxyOptions,
        [`${contextPath}/github`]: proxyOptions,
        [`${contextPath}/maps`]: proxyOptions,
        [`${contextPath}/plugins`]: proxyOptions,
        [`${contextPath}/source`]: proxyOptions,
        [`${contextPath}/sp`]: proxyOptions,
        [`${contextPath}/style`]: proxyOptions,
        [`${contextPath}/templates`]: proxyOptions,
        [`${contextPath}/tours`]: proxyOptions,
        [`${contextPath}/ua`]: proxyOptions,
        [`${contextPath}/userData`]: proxyOptions,
        [`${contextPath}/wb`]: proxyOptions,
        [`${contextPath}/widgets`]: proxyOptions
    },
    watchOptions: {
        ignored: ['**/userData/**']
    }
};

WebpackDevServer.addDevServerEntrypoints(webpackConfig[0], options);
const compiler = webpack(webpackConfig);
const server = new WebpackDevServer(compiler, options);

server.listen(devServerPort, host, err => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Listening at http://${host}:${devServerPort}/`);
    }
});

startWidgetBackendWatcher();
