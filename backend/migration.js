/**
 * Created by kinneretzin on 30/04/2017.
 */

const path = require('path');
const Umzug = require('umzug');
const _ = require('lodash');
const { db, init } = require('./db/Connection');

const command = process.argv[2].trim();
const forceLogLevel = command === 'current' ? 'error' : null;
const logger = require('./handler/LoggerHandler').getLogger('DBMigration', forceLogLevel);

let umzug = null;

function initUmzug() {
    const { sequelize } = db;
    umzug = new Umzug({
        storage: 'sequelize',
        storageOptions: {
            sequelize
        },

        // see: https://github.com/sequelize/umzug/issues/17
        migrations: {
            params: [
                sequelize.getQueryInterface(), // queryInterface
                sequelize.constructor, // DataTypes
                logger,
                // eslint-disable-next-line func-names
                function () {
                    throw new Error(
                        'Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.'
                    );
                }
            ],
            path: './migrations',
            pattern: /\.js$/
        },

        logging(...args) {
            logger.info(args);
        }
    });

    function logUmzugEvent(eventName) {
        return (name /* , migration */) => logger.info(`${name} ${eventName}`);
    }
    umzug.on('migrating', logUmzugEvent('migrating'));
    umzug.on('migrated', logUmzugEvent('migrated'));
    umzug.on('reverting', logUmzugEvent('reverting'));
    umzug.on('reverted', logUmzugEvent('reverted'));
}

function endMigration(exitCode = 0) {
    // eslint-disable-next-line no-process-exit
    process.exit(exitCode);
}

function getCurrent(executed) {
    return _.last(executed).file || '<NO_MIGRATIONS>';
}

function cmdStatus() {
    const result = {};

    return umzug
        .executed()
        .then(executed => {
            result.executed = executed;
            return umzug.pending();
        })
        .then(pending => {
            result.pending = pending;
            return result;
        })
        .then(res => {
            let { executed, pending } = res;

            executed = executed.map(m => {
                m.name = path.basename(m.file, '.js');
                return m;
            });
            pending = pending.map(m => {
                m.name = path.basename(m.file, '.js');
                return m;
            });

            const current = getCurrent(executed);
            const status = {
                current,
                executed: executed.map(m => m.file),
                pending: pending.map(m => m.file)
            };

            logger.info(JSON.stringify(status, null, 2));

            return { executed, pending };
        });
}

function cmdMigrate() {
    return umzug.up();
}

function cmdCurrent() {
    return umzug.executed().then(executed => {
        return Promise.resolve(getCurrent(executed));
    });
}

function cmdDownTo(migrationName) {
    if (!migrationName || migrationName === '') {
        return Promise.reject(new Error('Migration name to down to has to be supplied'));
    }

    return cmdStatus().then(result => {
        const executed = result.executed.map(m => m.file);
        if (executed.length === 0) {
            return Promise.reject(new Error('Already at initial state'));
        }

        const migrationIndex = executed.indexOf(migrationName);
        if (migrationIndex < 0) {
            // If its not found
            return Promise.reject(new Error("Migration doesn't exist or was not executed"));
        }
        if (migrationIndex + 1 >= executed.length) {
            // Or if its the last one so we cannot migrate to it - or actually one after it, then ignore)
            logger.info('Migration to downgrade to is the last migration, ignoring');
            return Promise.resolve();
        }
        const migrationToMigrateTo = executed[migrationIndex + 1];
        return umzug.down({ to: migrationToMigrateTo });
    });
}

function cmdReset() {
    return umzug.down({ to: 0 });
}

function cmdClear() {
    const { sequelize } = db;
    return sequelize
        .getQueryInterface()
        .showAllTables()
        .then(tableNames => {
            const promises = [];
            _.each(tableNames, tableName => {
                if (tableName !== 'SequelizeMeta') {
                    logger.info(`Clearing table ${tableName}`);
                    promises.push(sequelize.query(`truncate "${tableName}"`));
                }
            });

            return Promise.all(promises);
        });
}

function handleCommand(cmd) {
    let executedCmd;
    let downToMigration;

    logger.info(`${cmd.toUpperCase()} BEGIN`);

    switch (cmd) {
        case 'current':
            // eslint-disable-next-line no-console
            executedCmd = cmdCurrent().then(console.log);
            break;

        case 'status':
            executedCmd = cmdStatus();
            break;

        case 'up':
        case 'migrate':
            executedCmd = cmdMigrate();
            break;

        case 'downTo':
            downToMigration = process.argv[3].trim();
            executedCmd = cmdDownTo(downToMigration);
            break;

        case 'reset':
            executedCmd = cmdReset();
            break;
        case 'clear':
            executedCmd = cmdClear();
            break;
        default:
            logger.error(`invalid cmd: ${cmd}`);
            endMigration(1);
    }

    executedCmd
        .then(() => {
            const doneStr = `${cmd.toUpperCase()} DONE`;
            logger.info(doneStr);
            logger.info('='.repeat(doneStr.length));
        })
        .catch(err => {
            const errorStr = `${cmd.toUpperCase()} ERROR`;
            logger.error(errorStr);
            logger.error('='.repeat(errorStr.length));
            logger.error(err);
            logger.error('='.repeat(errorStr.length));
            endMigration(1);
        })
        .then(() => {
            if (cmd !== 'status' && cmd !== 'reset-hard') {
                return cmdStatus();
            }
            return Promise.resolve();
        })
        .then(() => endMigration(0));
}

init(forceLogLevel).then(() => {
    initUmzug();
    handleCommand(command);
});
