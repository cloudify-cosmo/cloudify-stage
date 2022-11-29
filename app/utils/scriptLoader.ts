import log from 'loglevel';
import StageUtils from './stageUtils';

export default class ScriptLoader {
    protected path: string;

    constructor(scriptPath: string) {
        this.path = StageUtils.Url.url(scriptPath);
    }

    load(id?: string, rejectOnError?: boolean) {
        log.log(`Loading javascript from ${this.path}...`);

        return new Promise((resolve, reject) => {
            const scriptObj = document.createElement('script');
            scriptObj.setAttribute('type', 'text/javascript');
            scriptObj.setAttribute('src', this.path);
            if (id) {
                scriptObj.setAttribute('id', id);
            }
            scriptObj.onload = () => {
                log.log(this.path, 'loaded');
                resolve(undefined);
            };
            scriptObj.onerror = () => {
                if (rejectOnError) {
                    reject(`Error loading ${this.path}`);
                } else {
                    log.error(`Error loading ${this.path}`);
                    resolve({ error: `Error loading ${this.path}` });
                }
            };

            document.getElementsByTagName('head')[0].appendChild(scriptObj);
        });
    }
}
