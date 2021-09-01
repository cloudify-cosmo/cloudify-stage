// @ts-nocheck File not migrated fully to TS
import { initLogging } from 'cloudify-ui-common/backend';
import _ from 'lodash';
import { getConfig } from '../config';

const loggerFactory = initLogging(getConfig().app);

loggerFactory.getStream = category => {
    const logger = loggerFactory.getLogger(category);
    return {
        write: message => logger.info(_.trim(message))
    };
};

export default loggerFactory;

export const { getLogger } = loggerFactory;
