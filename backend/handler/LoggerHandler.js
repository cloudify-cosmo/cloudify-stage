/**
 * Created by jakubniezgoda on 17/07/2017.
 */
const fs = require('fs');
const winston = require('winston');
const _ = require('lodash');
const config = require('../config').get();

const { logsFile, errorsFile } = config.app;

/**
 * Reads log level from manager's configuration file, as specified by `logLevelConf` configuration parameter.
 * See https://github.com/cloudify-cosmo/cloudify-manager/blob/master/packaging/mgmtworker/files/etc/cloudify/logging.conf
 */
function getLevelFromLoggingConf() {
    try {
        return _.chain(fs.readFileSync(config.app.logLevelConf))
            .split('\n')
            .filter(fileEntry => !fileEntry.startsWith('#'))
            .map(fileEntry => fileEntry.split(/\s+/))
            .find(fileEntryWords => _.last(fileEntryWords) === 'cloudify-stage')
            .first()
            .toLower()
            .thru(l => (l === 'warning' ? 'warn' : l))
            .value();
    } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(`Couldn't read logging level from ${config.app.logLevelConf}:`, e);
        return null;
    }
}

let logLevel;
if (config.app.logLevelConf) logLevel = getLevelFromLoggingConf();
logLevel = logLevel || config.app.logLevel;

const logsTransport = new winston.transports.File({ filename: logsFile });
const errorsTransport = new winston.transports.File({ filename: errorsFile, level: 'error' });
const consoleTransport = new winston.transports.Console({
    format: winston.format.colorize({ all: true })
});
const transports = [logsTransport, errorsTransport, consoleTransport];

module.exports = (() => {
    function getArgsSupportedLogger(logger) {
        // This is workaround for no support for multi-arguments logging, e.g.: logger.info('Part 1', 'Part 2')
        // See: https://github.com/winstonjs/winston/issues/1614
        const wrapper = original => {
            return (...args) => {
                for (let index = 0; index < args.length; index += 1) {
                    if (args[index] instanceof Error) {
                        args[index] = args[index].stack;
                    }
                }
                original(args.join(' '));
            };
        };

        logger.error = wrapper(logger.error);
        logger.warn = wrapper(logger.warn);
        logger.info = wrapper(logger.info);
        logger.verbose = wrapper(logger.verbose);
        logger.debug = wrapper(logger.debug);
        logger.silly = wrapper(logger.silly);

        return logger;
    }

    function getLogger(category, forceLogLevel) {
        const logFormat = winston.format.printf(
            ({ level, message, label, timestamp }) => `[${timestamp}][${label}] ${_.upperCase(level)}: ${message}`
        );

        const logger = winston.loggers.add(category, {
            level: forceLogLevel || logLevel,
            transports,

            format: winston.format.combine(
                winston.format.label({ label: category }),
                winston.format.timestamp(),
                logFormat
            )
        });

        return getArgsSupportedLogger(logger);
    }

    function getStream(category) {
        const logger = getLogger(category);
        return {
            write: message => logger.info(_.trim(message))
        };
    }

    return {
        getLogger,
        getStream
    };
})();
