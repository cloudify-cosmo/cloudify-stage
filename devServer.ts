import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import getWebpackConfig from './webpack.config';
import startWidgetBackendWatcher from './scripts/widgetBackendWatcher';

import { CONTEXT_PATH } from './backend/consts';
import { getBackendConfig } from './backend/config';

const backend = getBackendConfig();

const webpackConfig = getWebpackConfig({}, { mode: 'development' });

const devServerPort = 4000;

const stageBackendOptions: WebpackDevServer.HttpProxyMiddlewareOptions = {
    target: `http://${backend.host}:${backend.port}`,
    secure: false
};

const authServiceOptions: WebpackDevServer.HttpProxyMiddlewareOptions = {
    target: `http://${backend.host}`,
    secure: false
};

const options: WebpackDevServer.Configuration = {
    host: backend.host,
    port: devServerPort,
    historyApiFallback: {
        index: `${CONTEXT_PATH}/static/index.html`
    },
    proxy: {
        [`${CONTEXT_PATH}/auth`]: stageBackendOptions,
        [`${CONTEXT_PATH}/ba`]: stageBackendOptions,
        [`${CONTEXT_PATH}/bud`]: stageBackendOptions,
        [`${CONTEXT_PATH}/clientConfig`]: stageBackendOptions,
        [`${CONTEXT_PATH}/contactDetails`]: stageBackendOptions,
        [`${CONTEXT_PATH}/config`]: stageBackendOptions,
        [`${CONTEXT_PATH}/external`]: stageBackendOptions,
        [`${CONTEXT_PATH}/file`]: stageBackendOptions,
        [`${CONTEXT_PATH}/filters`]: stageBackendOptions,
        [`${CONTEXT_PATH}/github`]: stageBackendOptions,
        [`${CONTEXT_PATH}/maps`]: stageBackendOptions,
        [`${CONTEXT_PATH}/plugins`]: stageBackendOptions,
        [`${CONTEXT_PATH}/source`]: stageBackendOptions,
        [`${CONTEXT_PATH}/sp`]: stageBackendOptions,
        [`${CONTEXT_PATH}/style`]: stageBackendOptions,
        [`${CONTEXT_PATH}/templates`]: stageBackendOptions,
        [`${CONTEXT_PATH}/terraform`]: stageBackendOptions,
        [`${CONTEXT_PATH}/ua`]: stageBackendOptions,
        [`${CONTEXT_PATH}/userData`]: stageBackendOptions,
        [`${CONTEXT_PATH}/wb`]: stageBackendOptions,
        [`${CONTEXT_PATH}/widgets`]: stageBackendOptions,
        [`/auth`]: authServiceOptions
    },
    static: {
        publicPath: CONTEXT_PATH,
        watch: {
            ignored: ['**/userData/**']
        }
    },
    client: {
        // NOTE: Logging was disabled as it was cluttering the browser console with a lot of unnecessary logs (like e.g: "[webpack-dev-server] Nothing changed.")
        logging: 'none'
    }
};

// NOTE: TypeScript is not capable of figuring out which version of overloaded function to use without this condition
const compiler = Array.isArray(webpackConfig) ? webpack(webpackConfig) : webpack(webpackConfig);
const server = new WebpackDevServer(options, compiler);

server.startCallback(err => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Listening at http://${backend.host}:${devServerPort}/`);
    }
});

startWidgetBackendWatcher();
