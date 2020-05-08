/**
 * Created by jakub.niezgoda on 21/02/2019.
 */

const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');

const appConfig = require('../conf/app.json');

const widgetBackendFilename = appConfig.widgets.backendFilename;
const widgetBackendFilesGlob = `./widgets/*/src/${widgetBackendFilename}`;

const logger = {
    log: logString => console.log(`[widgetBackendWatcher] ${logString}`),
    error: errorString => console.error(`[widgetBackendWatcher] ${errorString}`)
};

// Update Widget Backend file
const updateWidgetBackendFile = (srcFilePath, event) => {
    const destFilePath = path.join(path.dirname(srcFilePath), '..', widgetBackendFilename);

    switch (event) {
        case 'add':
            logger.log(`File ${srcFilePath} has been added. Copying it to ${destFilePath}...`);
            fs.copyFileSync(srcFilePath, destFilePath);
            break;
        case 'change':
            logger.log(`File ${srcFilePath} has been changed. Updating ${destFilePath}...`);
            fs.copyFileSync(srcFilePath, destFilePath);
            break;
        case 'unlink':
            logger.log(`File ${srcFilePath} has been removed. Removing ${destFilePath}...`);
            fs.unlinkSync(destFilePath);
            break;
        default:
            logger.log(`Unhandled event on ${srcFilePath}.`);
    }
};

// Touch file in backend folder to trigger stage-backend server restart
const triggerBackendRestart = () => {
    const backendFile = path.join(__dirname, '..', 'backend/package.json');
    const now = new Date();

    logger.log(`Touching ${backendFile} to trigger stage-backend restart...`);
    fs.utimesSync(backendFile, now, now);
};

module.exports = function start() {
    chokidar
        .watch(widgetBackendFilesGlob)
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
};
