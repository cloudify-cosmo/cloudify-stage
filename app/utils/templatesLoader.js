/**
 * Created by kinneretzin on 08/09/2016.
 */

import fetch from 'isomorphic-fetch'
import StageUtils from './stageUtils';

export default class TemplateLoader {

    static load() {
        var templates = {};

        return fetch(StageUtils.url('/templates/templates.json'))
            .then(response => response.json())
            .then((data)=> {
                var promises = [];
                data.forEach((template)=>{
                    promises.push(fetch(StageUtils.url('/templates/'+template+'.json'))
                        .then(response => response.json())
                        .then((templateData=>templates[template] = templateData))
                        .catch(e=>{throw new Error('Error loading template ' +template,e);})
                    );
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
