/**
 * Created by kinneretzin on 11/09/2016.
 */

import StageUtils from './stageUtils';

export default class StyleLoader {
    constructor(stylePath) {
        this.path = StageUtils.Url.url(stylePath);
        this.loaded = false;
    }

    load() {
        const styleLoader = this;
        return new Promise(resolve => {
            const styleObj = document.createElement('link');
            styleObj.setAttribute('rel', 'stylesheet');
            styleObj.setAttribute('type', 'text/css');
            styleObj.setAttribute('href', styleLoader.path);
            styleObj.onload = () => {
                styleLoader.loaded = true;
                resolve();
            };

            document.getElementsByTagName('head')[0].appendChild(styleObj);

            // TODO Set timer to check if loaded or we got error
        });
    }
}
