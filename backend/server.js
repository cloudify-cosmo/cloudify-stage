/**
 * Created by kinneretzin on 05/12/2016.
 */

const Consts = require('./consts');
const LoggerHandler = require('./handler/LoggerHandler');
const { isDevelopmentOrTest } = require('./utils');

// Initialize logger
const logger = LoggerHandler.getLogger('Server');

// Initialize the DB connection
require('./db/Connection');

const ServerSettings = require('./serverSettings');

ServerSettings.init();

const ToursHandler = require('./handler/ToursHandler');
const WidgetHandler = require('./handler/WidgetHandler');
const TemplateHandler = require('./handler/TemplateHandler');
const app = require('./app');

module.exports = Promise.all([ToursHandler.init(), WidgetHandler.init(), TemplateHandler.init()])
    .then(() => {
        logger.info('Tours, widgets and templates data initialized successfully.');
        return new Promise((resolve, reject) => {
            const server = app.listen(Consts.SERVER_PORT, Consts.SERVER_HOST);
            server.on('error', reject);
            server.on('listening', () => {
                logger.info(`Server started in mode ${ServerSettings.settings.mode}`);
                if (isDevelopmentOrTest) {
                    logger.info('Server started for development');
                }
                logger.info(`Stage runs on ${Consts.SERVER_HOST}:${Consts.SERVER_PORT}!`);
                resolve(server);
            });
        });
    })
    .catch(error => {
        logger.error(`Server initialization failed. ${error}`);
        // eslint-disable-next-line no-process-exit
        process.exit(1);
    });
