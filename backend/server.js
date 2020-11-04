/**
 * Created by kinneretzin on 05/12/2016.
 */

const app = require('./app');
const Consts = require('./consts');
const DBConnection = require('./db/Connection');
const ToursHandler = require('./handler/ToursHandler');
const WidgetHandler = require('./handler/WidgetHandler');
const TemplateHandler = require('./handler/TemplateHandler');
const LoggerHandler = require('./handler/LoggerHandler');
const { isDevelopmentOrTest } = require('./utils');

const logger = LoggerHandler.getLogger('Server');
const ServerSettings = require('./serverSettings');

ServerSettings.init();

module.exports = DBConnection.init()
    .then(() => {
        logger.info('DB connection initialized successfully.');
        Promise.all([ToursHandler.init(), WidgetHandler.init(), TemplateHandler.init()]);
    })
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
