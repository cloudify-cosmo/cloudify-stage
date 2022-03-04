import _ from 'lodash';
import { db } from '../db/Connection';
import { getLogger } from './LoggerHandler';
import type { UserAppsInstance } from '../db/models/UserAppsModel';
import type { TabContent, WidgetDefinition } from '../routes/Templates.types';

const logger = getLogger('FilterHandler');

export async function getFilterUsage(filterId: string) {
    const userAppsArr = await db.UserApps.findAll<UserAppsInstance>({ attributes: ['appData', 'username'] });

    type FilterUses = { pageName: string; widgetName: string; username: string };

    const filterUses: FilterUses[] = [];
    _.forEach(userAppsArr, ({ appData, username }) => {
        _.forEach(appData.pages, page => {
            function checkWidgets(widgets: WidgetDefinition[]) {
                _.forEach(widgets, widget => {
                    const filterUsed =
                        widget.definition === 'deploymentsView' && widget?.configuration?.filterId === filterId;
                    if (filterUsed) {
                        filterUses.push({ pageName: page.name, widgetName: widget?.name || '', username });
                    }
                });
            }

            _.forEach(page.layout, ({ type, content }) => {
                if (type === 'widgets') {
                    checkWidgets(content as WidgetDefinition[]);
                } else if (type === 'tabs') {
                    _.forEach(content as TabContent[], tab => checkWidgets(tab.widgets));
                } else {
                    logger.warn('Unsupported layout type:', type);
                }
            });
        });
    });

    return filterUses;
}
