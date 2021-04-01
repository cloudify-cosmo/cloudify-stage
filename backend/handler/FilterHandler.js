const _ = require('lodash');
const { db } = require('../db/Connection');

const logger = require('./LoggerHandler').getLogger('FilterHandler');

module.exports = (() => {
    function getFilterUsage(filterId) {
        return db.UserApp.findAll({ attributes: ['appData', 'username'] }).then(userApp => {
            const result = [];
            _.forEach(userApp, ({ appData, username }) => {
                _.forEach(appData.pages, page => {
                    function checkWidgets(widgets) {
                        _.forEach(widgets, widget => {
                            if (widget.definition === 'deploymentsView' && widget.configuration.filterId === filterId) {
                                result.push({ pageName: page.name, widgetName: widget.name, username });
                            }
                        });
                    }

                    _.forEach(page.layout, ({ type, content }) => {
                        if (type === 'widgets') {
                            checkWidgets(content);
                        } else if (type === 'tabs') {
                            _.forEach(content, tab => checkWidgets(tab.widgets));
                        } else {
                            logger.warn('Unsupported layout type:', type);
                        }
                    });
                });
            });

            return result;
        });
    }

    return {
        getFilterUsage
    };
})();
