/**
 * Created by kinneretzin on 11/09/2016.
 */

import StageUtils from './stageUtils';

export default class ScriptLoader {
    constructor(scriptPath) {
        this.path = StageUtils.url(scriptPath);
        this.loaded = false;
    }

    load(id, rejectOnError) {
        console.log('Loading javascript from ' + this.path + '...');

        var scriptLoader = this;
        return new Promise((resolve,reject)=>{

            var scriptObj=document.createElement('script');
            scriptObj.setAttribute('type','text/javascript');
            scriptObj.setAttribute('src', scriptLoader.path);
            if (id) {
                scriptObj.setAttribute('id', id);
            }
            scriptObj.onload = () => {
                console.log(this.path, 'loaded');
                scriptLoader.loaded = true;
                resolve();
            };
            scriptObj.onerror = () => {
                if (rejectOnError) {
                    reject('Error loading ' + this.path);
                } else {
                    console.error('Error loading ' + this.path);
                    resolve({error: 'Error loading ' + this.path});
                }
            }

            document.getElementsByTagName('head')[0].appendChild(scriptObj);
        });
    }

}