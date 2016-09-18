/**
 * Created by kinneretzin on 08/09/2016.
 */

import fetch from 'isomorphic-fetch'


export default class TemplateLoader {

    static load() {
        var templates = {};

        return fetch('/templates/templates.json')
            .then(response => response.json())
            .then((data)=> {
                var promises = [];
                data.forEach((template)=>{
                    promises.push(fetch('/templates/'+template+'.json')
                        .then(response => response.json())
                        .then((templateData=>templates[template] = templateData)));
                });
                return Promise.all(promises);
            })
            .then(()=> {
                return templates;
            })
            .catch((e)=>{
                console.error(e);
            });
    }
}
