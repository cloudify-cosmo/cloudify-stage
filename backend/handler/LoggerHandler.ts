import { initLogging } from 'cloudify-ui-common-backend';
import type { LoggerFactory, Logger } from 'cloudify-ui-common-backend';
import _ from 'lodash';
import { getConfig } from '../config';

type ExtendedLoggerFactory = LoggerFactory & {
    getStream: (category: string) => { write: (message: any) => ReturnType<Logger['info']> };
};
const loggerFactory = initLogging(getConfig().app) as ExtendedLoggerFactory;

loggerFactory.getStream = category => {
    const logger = loggerFactory.getLogger(category);
    return {
        write: message => logger.info(_.trim(message))
    };
};

export default loggerFactory;

export const { getLogger } = loggerFactory;
