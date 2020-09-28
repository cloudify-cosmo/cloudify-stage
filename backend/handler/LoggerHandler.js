/**
 * Created by jakubniezgoda on 17/07/2017.
 */

const winston = require('winston');
const _ = require('lodash');
const config = require('../config').get();

const { logLevel, logsFile, errorsFile } = config.app;

module.exports = (function() {
    function getArgsSupportedLogger(logger) {
        // This is workaround for no support for multi-arguments logging, e.g.: logger.info('Part 1', 'Part 2')
        // See: https://github.com/winstonjs/winston/issues/1614
        const wrapper = original => {
            return (...args) => {
                for (let index = 0; index < args.length; index++) {
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

    function getLogger(category) {
        const logFormat = winston.format.printf(
            ({ level, message, label, timestamp }) => `[${timestamp}][${label}] ${_.upperCase(level)}: ${message}`
        );

        const logger = winston.loggers.add(category, {
            level: logLevel,
            transports: [
                new winston.transports.File({ filename: logsFile }),
                new winston.transports.File({ filename: errorsFile, level: 'error' }),
                new winston.transports.Console({
                    format: winston.format.colorize({ all: true })
                })
            ],

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
