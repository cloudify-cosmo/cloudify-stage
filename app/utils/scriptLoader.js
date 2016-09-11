/**
 * Created by kinneretzin on 11/09/2016.
 */


export default class ScriptLoader {
    constructor(scriptPath) {
        this.path = scriptPath;
        this.loaded = false;
    }

    load() {
        var scriptLoader = this;
        return new Promise((resolve,reject)=>{

            var scriptObj=document.createElement('script');
            scriptObj.setAttribute("type","text/javascript");
            scriptObj.setAttribute("src", scriptLoader.path);
            scriptObj.onload = () => {
                scriptLoader.loaded = true;
                resolve();
            };

            document.getElementsByTagName("head")[0].appendChild(scriptObj);

            // TODO Set timer to check if loaded or we got error

        });
    }

}