/**
 * Created by kinneretzin on 29/08/2016.
 */

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const webpackConfig = require('./webpack.config')({}, { mode: 'development' });
const Consts = require('./backend/consts');
const startWidgetBackendWatcher = require('./scripts/widgetBackendWatcher');

const host = 'localhost';
const devServerPort = 4000;
const stageBackendPort = 8088;
const contextPath = Consts.CONTEXT_PATH;

const proxyOptions = {
    target: `http://${host}:${stageBackendPort}`,
    secure: false
};

const options = {
    publicPath: contextPath,
    host,
    inline: false,
    historyApiFallback: {
        index: `${contextPath}/static/index.html`
    },
    proxy: {
        [`${contextPath}/sp`]: proxyOptions,
        [`${contextPath}/auth`]: proxyOptions,
        [`${contextPath}/config`]: proxyOptions,
        [`${contextPath}/ua`]: proxyOptions,
        [`${contextPath}/source`]: proxyOptions,
        [`${contextPath}/ba`]: proxyOptions,
        [`${contextPath}/bud`]: proxyOptions,
        [`${contextPath}/clientConfig`]: proxyOptions,
        [`${contextPath}/github`]: proxyOptions,
        [`${contextPath}/external`]: proxyOptions,
        [`${contextPath}/style`]: proxyOptions,
        [`${contextPath}/widgets`]: proxyOptions,
        [`${contextPath}/templates`]: proxyOptions,
        [`${contextPath}/tours`]: proxyOptions,
        [`${contextPath}/wb`]: proxyOptions,
        [`${contextPath}/file`]: proxyOptions,
        [`${contextPath}/plugins`]: proxyOptions,
        [`${contextPath}/userData`]: proxyOptions
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
