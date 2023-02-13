import { watch } from 'chokidar';
import { copyFileSync, unlinkSync, utimesSync } from 'fs';
import { basename, join, dirname } from 'path';

import appConfig from '../conf/config.json';

const widgetBackendFilesGlob = `./widgets/*/src/${
    appConfig.widgets.backendFilename
}.{${appConfig.widgets.backendFilenameExtensions.join()}}`;

const logger = {
    log: (logString: string) => console.log(`[widgetBackendWatcher] ${logString}`),
    error: (errorString: string) => console.error(`[widgetBackendWatcher] ${errorString}`)
};

// Update Widget Backend file
const updateWidgetBackendFile = (srcFilePath: string, event: 'add' | 'change' | 'unlink') => {
    const destFilePath = join(dirname(srcFilePath), '..', basename(srcFilePath));

    switch (event) {
        case 'add':
            logger.log(`File ${srcFilePath} has been added. Copying it to ${destFilePath}...`);
            copyFileSync(srcFilePath, destFilePath);
            break;
        case 'change':
            logger.log(`File ${srcFilePath} has been changed. Updating ${destFilePath}...`);
            copyFileSync(srcFilePath, destFilePath);
            break;
        case 'unlink':
            logger.log(`File ${srcFilePath} has been removed. Removing ${destFilePath}...`);
            unlinkSync(destFilePath);
            break;
        default:
            logger.log(`Unhandled event on ${srcFilePath}.`);
    }
};

// Touch file in backend folder to trigger stage-backend server restart
const triggerBackendRestart = () => {
    const backendFile = join(__dirname, '..', 'backend/package.json');
    const now = new Date();

    logger.log(`Touching ${backendFile} to trigger stage-backend restart...`);
    utimesSync(backendFile, now, now);
};

export default function start() {
    watch(widgetBackendFilesGlob)
        .on('add', file => {
            updateWidgetBackendFile(file, 'add');
            triggerBackendRestart();
        })
        .on('change', file => {
            updateWidgetBackendFile(file, 'change');
            triggerBackendRestart();
        })
        .on('unlink', file => {
            updateWidgetBackendFile(file, 'unlink');
            triggerBackendRestart();
        })
        .on('ready', () => logger.log(`Widget Backend files watcher ready and set on: ${widgetBackendFilesGlob}`))
        .on('error', error => logger.error(`Watcher error: ${error}`));
}
