import type { Server } from 'http';
import app from './app';
import DBConnection from './db/Connection';
import { init as initWidgetsHandler } from './handler/widgets/WidgetsHandler';
import { init as initTemplatesHandler } from './handler/templates';
import { getLogger } from './handler/LoggerHandler';
import { isDevelopmentOrTest } from './utils';

import { getMode, init } from './serverSettings';
import { getBackendConfig } from './config';

const logger = getLogger('Server');

init();

export default DBConnection.init()
    .then(() => {
        logger.info('DB connection initialized successfully.');
        return Promise.all([initWidgetsHandler(), initTemplatesHandler()]);
    })
    .then(() => {
        logger.info('Widgets and templates data initialized successfully.');
        return new Promise((resolve, reject) => {
            const { host, port } = getBackendConfig();
            const server = host ? app.listen(port, host) : app.listen(port);
            server.on('error', reject);
            server.on('listening', () => {
                logger.info(`Server started in mode ${getMode()}`);
                if (isDevelopmentOrTest) {
                    logger.info('Server started for development');
                }
                logger.info(`Stage runs on ${host}:${port}!`);
                resolve(server);
            });
        });
    })
    .catch(error => {
        logger.error(`Server initialization failed`, error);
        // eslint-disable-next-line no-process-exit
        process.exit(1);
    }) as Promise<Server>;
