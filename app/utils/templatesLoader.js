/**
 * Created by kinneretzin on 08/09/2016.
 */

import Internal from './Internal';
import LoaderUtils from './LoaderUtils';

export default class TemplateLoader {
    static load(manager) {
        log.log('Load templates');

        const templatesDef = {};
        const pagesDef = {};
        const internal = new Internal(manager);
        return Promise.all([internal.doGet('/templates'), internal.doGet('/templates/pages')])
            .then(data => {
                const templateList = data[0];
                const pageList = data[1];

                const promises = [];
                templateList.forEach(item => {
                    promises.push(
                        LoaderUtils.fetchResource(`templates/${item.id}.json`, item.custom)
                            .then(templateData => {
                                templatesDef[item.id] = templateData;
                            })
                            .catch(e => {
                                throw new Error(`Error loading template ${item.id}`, e);
                            })
                    );
                });

                pageList.forEach(item => {
                    promises.push(
                        LoaderUtils.fetchResource(`templates/pages/${item.id}.json`, item.custom)
                            .then(pageData => {
                                pagesDef[item.id] = pageData;
                            })
                            .catch(e => {
                                throw new Error(`Error loading page template ${item.id}`, e);
                            })
                    );
                });

                return Promise.all(promises);
            })
            .then(() => {
                return { templatesDef, pagesDef };
            })
            .catch(e => {
                log.error(e);
            });
    }
}
