import StageUtils from './stageUtils';

export default class StyleLoader {
    path: string;

    loaded: boolean;

    constructor(stylePath: string) {
        this.path = StageUtils.Url.url(stylePath);
        this.loaded = false;
    }

    load() {
        return new Promise(resolve => {
            const styleObj = document.createElement('link');
            styleObj.setAttribute('rel', 'stylesheet');
            styleObj.setAttribute('type', 'text/css');
            styleObj.setAttribute('href', this.path);
            styleObj.onload = () => {
                this.loaded = true;
                resolve(undefined);
            };

            document.getElementsByTagName('head')[0].appendChild(styleObj);

            // TODO Set timer to check if loaded or we got error
        });
    }
}
