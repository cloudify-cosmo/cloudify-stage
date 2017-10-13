/**
 * Created by kinneretzin on 08/09/2016.
 */


import Internal from './Internal'

export default class TemplateLoader {

    static load(manager) {
        console.log('Load templates');

        var templates = {};
        var internal = new Internal(manager);
        return Promise.all([internal.doGet('/templates'), internal.doGet('/templates/pages')])
            .then((data)=> {
                var templateList = data[0];
                var pageList = data[1];

                var promises = [];
                templateList.forEach((item)=>{
                    promises.push(internal.doGet(`/templates/${item.id}.json`)
                        .then((templateData => templates[item.id] = templateData))
                        .catch(e=>{throw new Error('Error loading template ' +item.id,e);})
                    );
                });

                pageList.forEach((item)=>{
                    promises.push(internal.doGet(`/templates/pages/${item.id}.json`)
                        .then((pageData => templates[item.id] = pageData))
                        .catch(e=>{throw new Error('Error loading page template ' +item.id,e);})
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
