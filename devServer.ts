import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import getWebpackConfig from './webpack.config';
import startWidgetBackendWatcher from './scripts/widgetBackendWatcher';

import { CONTEXT_PATH, SERVER_HOST, SERVER_PORT } from './backend/consts';

const webpackConfig = getWebpackConfig({}, { mode: 'development' });

const devServerPort = 4000;

const proxyOptions = {
    target: `http://${SERVER_HOST}:${SERVER_PORT}`,
    secure: false
};

const options = {
    publicPath: CONTEXT_PATH,
    host: SERVER_HOST,
    inline: false,
    historyApiFallback: {
        index: `${CONTEXT_PATH}/static/index.html`
    },
    proxy: {
        [`${CONTEXT_PATH}/auth`]: proxyOptions,
        [`${CONTEXT_PATH}/ba`]: proxyOptions,
        [`${CONTEXT_PATH}/bud`]: proxyOptions,
        [`${CONTEXT_PATH}/clientConfig`]: proxyOptions,
        [`${CONTEXT_PATH}/contactDetails`]: proxyOptions,
        [`${CONTEXT_PATH}/config`]: proxyOptions,
        [`${CONTEXT_PATH}/external`]: proxyOptions,
        [`${CONTEXT_PATH}/file`]: proxyOptions,
        [`${CONTEXT_PATH}/filters`]: proxyOptions,
        [`${CONTEXT_PATH}/github`]: proxyOptions,
        [`${CONTEXT_PATH}/maps`]: proxyOptions,
        [`${CONTEXT_PATH}/plugins`]: proxyOptions,
        [`${CONTEXT_PATH}/source`]: proxyOptions,
        [`${CONTEXT_PATH}/sp`]: proxyOptions,
        [`${CONTEXT_PATH}/style`]: proxyOptions,
        [`${CONTEXT_PATH}/templates`]: proxyOptions,
        [`${CONTEXT_PATH}/terraform`]: proxyOptions,
        [`${CONTEXT_PATH}/ua`]: proxyOptions,
        [`${CONTEXT_PATH}/userData`]: proxyOptions,
        [`${CONTEXT_PATH}/wb`]: proxyOptions,
        [`${CONTEXT_PATH}/widgets`]: proxyOptions
    },
    watchOptions: {
        ignored: ['**/userData/**']
    }
};

WebpackDevServer.addDevServerEntrypoints(webpackConfig[0], options);
const compiler = webpack(webpackConfig);
const server = new WebpackDevServer(compiler, options);

server.listen(devServerPort, SERVER_HOST, err => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Listening at http://${SERVER_HOST}:${devServerPort}/`);
    }
});

startWidgetBackendWatcher();
