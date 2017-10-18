/**
 * Created by kinneretzin on 08/09/2016.
 */


import Internal from './Internal'

export default class TemplateLoader {

    static load(manager) {
        console.log('Load templates');

        var templatesDef = {}, pagesDef = {};
        var internal = new Internal(manager);
        return Promise.all([internal.doGet('/templates'), internal.doGet('/templates/pages')])
            .then((data)=> {
                var templateList = data[0];
                var pageList = data[1];

                var promises = [];
                templateList.forEach((item)=>{
                    promises.push(internal.doGet(`/templates/${item.id}.json`)
                        .then((templateData => templatesDef[item.id] = templateData))
                        .catch(e=>{throw new Error('Error loading template ' +item.id,e);})
                    );
                });

                pageList.forEach((item)=>{
                    promises.push(internal.doGet(`/templates/pages/${item.id}.json`)
                        .then((pageData => pagesDef[item.id] = pageData))
                        .catch(e=>{throw new Error('Error loading page template ' +item.id,e);})
                    );
                });

                return Promise.all(promises);
            })
            .then(()=> {
                return {templatesDef, pagesDef};
            })
            .catch((e)=>{
                console.error(e);
            });
    }
}
