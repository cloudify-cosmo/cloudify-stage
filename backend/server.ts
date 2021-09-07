// @ts-nocheck File not migrated fully to TS
import app from './app';
import { SERVER_HOST, SERVER_PORT } from './consts';
import DBConnection from './db/Connection';
import * as WidgetHandler from './handler/WidgetHandler';
import * as TemplateHandler from './handler/TemplateHandler';
import { getLogger } from './handler/LoggerHandler';
import { isDevelopmentOrTest } from './utils';

import { init, getMode } from './serverSettings';

const logger = getLogger('Server');

init();

export default DBConnection.init()
    .then(() => {
        logger.info('DB connection initialized successfully.');
        return Promise.all([WidgetHandler.init(), TemplateHandler.init()]);
    })
    .then(() => {
        logger.info('Widgets and templates data initialized successfully.');
        return new Promise((resolve, reject) => {
            const server = app.listen(SERVER_PORT, SERVER_HOST);
            server.on('error', reject);
            server.on('listening', () => {
                logger.info(`Server started in mode ${getMode()}`);
                if (isDevelopmentOrTest) {
                    logger.info('Server started for development');
                }
                logger.info(`Stage runs on ${SERVER_HOST}:${SERVER_PORT}!`);
                resolve(server);
            });
        });
    })
    .catch(error => {
        logger.error(`Server initialization failed`, error);
        // eslint-disable-next-line no-process-exit
        process.exit(1);
    });
