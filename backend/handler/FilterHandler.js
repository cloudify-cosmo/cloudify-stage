const _ = require('lodash');
const { db } = require('../db/Connection');

const logger = require('./LoggerHandler').getLogger('FilterHandler');

async function getFilterUsage(filterId) {
    const userAppsArr = await db.UserApp.findAll({ attributes: ['appData', 'username'] });

    const filterUses = [];
    _.forEach(userAppsArr, ({ appData, username }) => {
        _.forEach(appData.pages, page => {
            function checkWidgets(widgets) {
                _.forEach(widgets, widget => {
                    const filteUsed =
                        widget.definition === 'deploymentsView' && widget.configuration.filterId === filterId;
                    if (filteUsed) {
                        filterUses.push({ pageName: page.name, widgetName: widget.name, username });
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

    return filterUses;
}

module.exports = {
    getFilterUsage
};
