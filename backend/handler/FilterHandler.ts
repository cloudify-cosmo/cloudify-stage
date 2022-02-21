// @ts-nocheck File not migrated fully to TS
import _ from 'lodash';
import { db } from '../db/Connection';
import { LAYOUT } from '../consts';
import { getLogger } from './LoggerHandler';

const logger = getLogger('FilterHandler');

export async function getFilterUsage(filterId) {
    const userAppsArr = await db.UserApps.findAll({ attributes: ['appData', 'username'] });

    const filterUses = [];
    _.forEach(userAppsArr, ({ appData, username }) => {
        _.forEach(appData.pages, page => {
            function checkWidgets(widgets) {
                _.forEach(widgets, widget => {
                    const filterUsed =
                        widget.definition === 'deploymentsView' && widget.configuration.filterId === filterId;
                    if (filterUsed) {
                        filterUses.push({ pageName: page.name, widgetName: widget.name, username });
                    }
                });
            }

            _.forEach(page.layout, ({ type, content }) => {
                if (type === LAYOUT.WIDGETS) {
                    checkWidgets(content);
                } else if (type === LAYOUT.TABS) {
                    _.forEach(content, tab => checkWidgets(tab.widgets));
                } else {
                    logger.warn('Unsupported layout type:', type);
                }
            });
        });
    });

    return filterUses;
}
