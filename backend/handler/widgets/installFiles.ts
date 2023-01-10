import pathlib from 'path';
import fs from 'fs-extra';
import { userWidgetsFolder } from './WidgetsHandler';

function rmdirSync(path: string) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(file => {
            const curPath = `${path}/${file}`;
            if (fs.lstatSync(curPath).isDirectory()) {
                // recurse
                rmdirSync(curPath);
            } else {
                // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

export default function installFiles(widgetId: string, tempPath: string) {
    const installPath = pathlib.resolve(userWidgetsFolder, widgetId);

    return new Promise<void>((resolve, reject) => {
        rmdirSync(installPath);
        fs.move(tempPath, installPath, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
