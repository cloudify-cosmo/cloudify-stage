const Sequelize = require('sequelize');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const request = require('request');
const config = require('../config').get();
const loggerHandler = require('../handler/LoggerHandler');

const db = {};
let logger = null;

function getDbOptions(configOptions) {
    const options = _.merge(
        {
            logging: (message /* , sequelize */) => logger.debug(message)
        },
        configOptions
    );

    if (options.dialectOptions.ssl) {
        options.dialectOptions.ssl.ca = fs.readFileSync(options.dialectOptions.ssl.ca, { encoding: 'utf8' });
        if (options.dialectOptions.ssl.cert) {
            // If the cert is provided, the key will also be provided by the installer.
            options.dialectOptions.ssl.cert = fs.readFileSync(options.dialectOptions.ssl.cert, { encoding: 'utf8' });
            options.dialectOptions.ssl.key = fs.readFileSync(options.dialectOptions.ssl.key, { encoding: 'utf8' });
        }
    }

    return options;
}

async function selectDbUrl() {
    function getHostUrl(dbUrl) {
        return `https://${new URL(dbUrl).hostname}:8008`;
    }
    function isResponding(url) {
        return new Promise(resolve =>
            request(
                {
                    url,
                    strictSSL: false
                },
                (error, response) => {
                    if (error) {
                        logger.debug(`Error occured when requesting: ${url}.`, error);
                        resolve(false);
                    } else {
                        resolve(response.statusCode === 200);
                    }
                }
            )
        );
    }
    function wait(seconds) {
        return new Promise(resolve => setTimeout(resolve, 1000 * seconds));
    }
    async function findRespondingHost(urls) {
        let respondingHost = null;

        /* eslint-disable no-await-in-loop */
        do {
            for (let i = 0; i < urls.length; i += 1) {
                const dbHost = getHostUrl(urls[i]);
                logger.info(`Checking DB host ${i}: ${dbHost}`);
                const hasResponded = await isResponding(dbHost);
                if (hasResponded) {
                    logger.debug(`DB host ${dbHost} has responded.`);
                    respondingHost = urls[i];
                    break;
                } else {
                    logger.debug(`DB host ${dbHost} not responding.`);
                }
            }
            if (!respondingHost) {
                await wait(1);
                logger.info(`Retrying DB host selection...`);
            }
        } while (!respondingHost);
        /* eslint-enable no-await-in-loop */

        return respondingHost;
    }

    const dbUrls = config.app.db.url;
    let selectedDbUrl = null;

    if (_.isString(dbUrls)) {
        selectedDbUrl = dbUrls;
    } else if (_.isArray(dbUrls)) {
        logger.info('Selecting DB host...');
        selectedDbUrl = await findRespondingHost(dbUrls);
    } else {
        throw new Error(
            'Invalid type of db.url parameter passed to the configuration. Expected string or array of strings.'
        );
    }

    if (!selectedDbUrl) {
        throw new Error('None of the DBs defined in the configuration (db.url) responded.');
    }

    logger.info(`Selected DB URL: ${selectedDbUrl}`);
    return selectedDbUrl;
}

function addModels(sequelize) {
    const excludes = ['.', 'Connection.js', 'types'];
    fs.readdirSync(__dirname)
        .filter(file => _.indexOf(excludes, file) < 0)
        .forEach(file => {
            const model = sequelize.import(path.join(__dirname, file));
            db[model.name] = model;
        });
}

function addHooks(sequelize, restart) {
    sequelize.afterDisconnect(async ({ _invalid: unexpectedDisconnection }) => {
        if (unexpectedDisconnection) {
            restart('Unexpected disconnection occured.');
        }
    });
    sequelize.beforeQuery(async ({ isRecoveryCheck }) => {
        if (!isRecoveryCheck) {
            const result = await sequelize.query('SELECT pg_is_in_recovery();', {
                plain: true,
                type: Sequelize.QueryTypes.SELECT,
                isRecoveryCheck: true
            });
            if (result && result.pg_is_in_recovery) {
                restart('DB is in recovery.');
            }
        }
    });
}

async function init(forceLogLevel) {
    logger = loggerHandler.getLogger('DBConnection', forceLogLevel);
    const { options, url } = config.app.db;
    const dbOptions = getDbOptions(options);
    const dbUrl = await selectDbUrl(url);
    const sequelize = new Sequelize(dbUrl, dbOptions);
    let isRestarting = false;

    async function restart(reason) {
        if (!isRestarting) {
            isRestarting = true;
            logger.info(`${reason} Re-initializing DB...`);
            await sequelize.close();
            init();
        }
    }

    addModels(sequelize);
    addHooks(sequelize, restart);

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;
}

module.exports = { init, db };
