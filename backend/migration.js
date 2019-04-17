/**
 * Created by kinneretzin on 30/04/2017.
 */

const path = require('path');
const db = require('./db/Connection');
const Umzug = require('umzug');
const _ = require('lodash');

const sequelize = db.sequelize;
let logger = require('./handler/LoggerHandler').getLogger('DBMigration');

const umzug = new Umzug({
    storage: 'sequelize',
    storageOptions: {
        sequelize: sequelize
    },

    // see: https://github.com/sequelize/umzug/issues/17
    migrations: {
        params: [
            sequelize.getQueryInterface(), // queryInterface
            sequelize.constructor, // DataTypes
            logger,
            function() {
                throw new Error('Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.');
            }
        ],
        path: './migrations',
        pattern: /\.js$/
    },

    logging: function() {
        logger.info.apply(logger, arguments);
    }
});

function logUmzugEvent(eventName) {
    return function(name, migration) {
        logger.info(`${ name } ${ eventName }`);
    }
}
umzug.on('migrating', logUmzugEvent('migrating'));
umzug.on('migrated',  logUmzugEvent('migrated'));
umzug.on('reverting', logUmzugEvent('reverting'));
umzug.on('reverted',  logUmzugEvent('reverted'));

function cmdStatus() {
    let result = {};

    return umzug.executed()
        .then(executed => {
            result.executed = executed;
            return umzug.pending();
        }).then(pending => {
            result.pending = pending;
            return result;
        }).then(result => {
            let executed = result.executed;
            let pending = result.pending;

            executed = executed.map(m => {
                m.name = path.basename(m.file, '.js');
                return m;
            });
            pending = pending.map(m => {
                m.name = path.basename(m.file, '.js');
                return m;
            });

            const current = executed.length > 0 ? executed[0].file : '<NO_MIGRATIONS>';
            const status = {
                current: current,
                executed: executed.map(m => m.file),
                pending: pending.map(m => m.file),
            };

            logger.info(JSON.stringify(status, null, 2));

            return { executed, pending };
        })
}

function cmdMigrate() {
    return umzug.up();
}

function getCurrMigration() {
    return umzug.executed()
        .then((executed) => {
            return Promise.resolve(executed.length > 0 ? _.last(executed).file : '<NO_MIGRATIONS>');
        });
}


function cmdDownTo(migrationName) {
    if (!migrationName || migrationName === '') {
        return Promise.reject(new Error('Migration name to down to has to be supplied'));
    }

    return cmdStatus()
        .then((result) => {
            const executed = result.executed.map(m => m.file);
            if (executed.length === 0) {
                return Promise.reject(new Error('Already at initial state'));
            }

            const migrationIndex = executed.indexOf(migrationName);
            if (migrationIndex < 0 ) { // If its not found
                return Promise.reject(new Error('Migration doesn\'t exist or was not executed'));
            } else if (migrationIndex + 1 >= executed.length){ // Or if its the last one so we cannot migrate to it - or actually one after it, then ignore)
                return Promise.reject(new Error('Migration to downgrade to is the last migration, ignoring'));
            } else {

                const migrationToMigrateTo = executed[migrationIndex+1];
                return umzug.down({to: migrationToMigrateTo});
            }

        })
}

function cmdReset() {
    return umzug.down({ to: 0 });
}

function cmdClear() {
    return sequelize.getQueryInterface().showAllTables().then(function(tableNames) {
        let promises = [];
        _.each(tableNames,function(tableName){
            if (tableName !== 'SequelizeMeta') {
                logger.info('Clearing table '+tableName);
                promises.push(sequelize.query('truncate "' + tableName+'"'));
            }
        });

        return Promise.all(promises);
    });
}


function handleCommand(cmd) {
    let executedCmd;

    logger.info(`${ cmd.toUpperCase() } BEGIN`);

    switch(cmd) {
        case 'status':
            executedCmd = cmdStatus();
            break;

        case 'up':
        case 'migrate':
            executedCmd = cmdMigrate();
            break;

        case 'downTo':
            const downToMigration = process.argv[3].trim();
            executedCmd = cmdDownTo(downToMigration);
            break;

        case 'reset':
            executedCmd = cmdReset();
            break;
        case 'clear':
            executedCmd = cmdClear();
            break;
        default:
            logger.error(`invalid cmd: ${ cmd }`);
            process.exit(1);
    }

    executedCmd
        .then((result) => {
            const doneStr = `${ cmd.toUpperCase() } DONE`;
            logger.info(doneStr);
            logger.info('='.repeat(doneStr.length));
        })
        .catch(err => {
            const errorStr = `${ cmd.toUpperCase() } ERROR`;
            logger.error(errorStr);
            logger.error('='.repeat(errorStr.length));
            logger.error(err);
            logger.error('='.repeat(errorStr.length));
        })
        .then(() => {
            if (cmd !== 'status' && cmd !== 'reset-hard') {
                return cmdStatus()
            }
            return Promise.resolve();
        })
        .then(() => process.exit(0));
}


const cmd = process.argv[2].trim();

// Make an exception because we dont want all the printout around it
if (cmd === 'current') {
    getCurrMigration()
        .then(current => {
            console.log(current);
            process.exit(0)
        });
} else {
    handleCommand(cmd);
}

