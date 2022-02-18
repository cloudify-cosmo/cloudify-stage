import { sync as mkdirpSync } from 'mkdirp';
import { userTemplatesFolder } from './TemplatesHandler';
import { userPagesFolder } from './PagesHandler';
import { getLogger } from '../LoggerHandler';
import { userPageGroupsFolder } from './PageGroupsHandler';

const logger = getLogger('TemplatesHandler');

export function init() {
    return new Promise<void>((resolve, reject) => {
        try {
            logger.info('Setting up user templates directory:', userTemplatesFolder);
            mkdirpSync(userTemplatesFolder);
            logger.info('Setting up user pages directory:', userPagesFolder);
            mkdirpSync(userPagesFolder);
            logger.info('Setting up user page groups directory:', userPagesFolder);
            mkdirpSync(userPageGroupsFolder);
            return resolve();
        } catch (e) {
            logger.error('Could not set up directories for templates and pages, error was:', e);
            return reject(`Could not set up directories for templates and pages, error was: ${e}`);
        }
    });
}
