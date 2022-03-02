import _ from 'lodash';
import { db } from '../db/Connection';
import { LAYOUT } from '../consts';
import { getLogger } from './LoggerHandler';
import type { UserAppsInstance } from '../db/models/UserAppsModel';

const logger = getLogger('FilterHandler');

export async function getFilterUsage(filterId: string) {
    const userAppsArr = await db.UserApps.findAll<UserAppsInstance>({ attributes: ['appData', 'username'] });

    type FilterUses = { pageName: string; widgetName: string; username: string };
    type Widget = { name?: string; definition: string; configuration?: Record<string, any> };

    const filterUses: FilterUses[] = [];
    _.forEach(userAppsArr, ({ appData, username }) => {
        _.forEach(appData.pages, page => {
            function checkWidgets(widgets: Widget[]) {
                _.forEach(widgets, widget => {
                    const filterUsed =
                        widget.definition === 'deploymentsView' && widget?.configuration?.filterId === filterId;
                    if (filterUsed) {
                        filterUses.push({ pageName: page.name, widgetName: widget?.name || '', username });
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
