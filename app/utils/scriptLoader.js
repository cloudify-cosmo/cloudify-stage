/**
 * Created by kinneretzin on 11/09/2016.
 */
import log from 'loglevel';
import StageUtils from './stageUtils';

export default class ScriptLoader {
    constructor(scriptPath) {
        this.path = StageUtils.Url.url(scriptPath);
        this.loaded = false;
    }

    load(id, rejectOnError) {
        log.log(`Loading javascript from ${this.path}...`);

        const scriptLoader = this;
        return new Promise((resolve, reject) => {
            const scriptObj = document.createElement('script');
            scriptObj.setAttribute('type', 'text/javascript');
            scriptObj.setAttribute('src', scriptLoader.path);
            if (id) {
                scriptObj.setAttribute('id', id);
            }
            scriptObj.onload = () => {
                log.log(this.path, 'loaded');
                scriptLoader.loaded = true;
                resolve();
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
