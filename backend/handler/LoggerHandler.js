const { initLogging } = require('cloudify-ui-common/backend');
const _ = require('lodash');
const config = require('../config').get().app;

const loggerFactory = initLogging(config);

loggerFactory.getStream = category => {
    const logger = loggerFactory.getLogger(category);
    return {
        write: message => logger.info(_.trim(message))
    };
};

module.exports = loggerFactory;
