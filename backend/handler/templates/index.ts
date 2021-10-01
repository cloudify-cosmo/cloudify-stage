import { sync as mkdirpSync } from 'mkdirp';
import { userTemplatesFolder } from './TemplatesHandler';
import { userPagesFolder } from './PagesHandler';
import { getLogger } from '../LoggerHandler';

const logger = getLogger('TemplateHandler');

// eslint-disable-next-line import/prefer-default-export
export function init() {
    return new Promise<void>((resolve, reject) => {
        try {
            logger.info('Setting up user templates directory:', userTemplatesFolder);
            mkdirpSync(userTemplatesFolder);
            logger.info('Setting up user pages directory:', userPagesFolder);
            mkdirpSync(userPagesFolder);
            return resolve();
        } catch (e) {
            logger.error('Could not set up directories for templates and pages, error was:', e);
            return reject(`Could not set up directories for templates and pages, error was: ${e}`);
        }
    });
}
