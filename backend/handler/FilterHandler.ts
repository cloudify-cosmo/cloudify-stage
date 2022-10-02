import _ from 'lodash';
import { db } from '../db/Connection';
import { getLogger } from './LoggerHandler';
import type { UserAppsInstance } from '../db/models/UserAppsModel';
import type { LayoutSection, TabContent, WidgetDefinition } from './templates/types';
import type { FilterUses } from './FilterHandler.types';

const logger = getLogger('FilterHandler');

export async function getFilterUsage(filterId: string) {
    const userAppsArr = await db.UserApps.findAll<UserAppsInstance>({ attributes: ['appData', 'username'] });

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

            function checkLayout(layout: LayoutSection[]) {
                _.forEach(layout, ({ type, content }) => {
                    if (type === 'widgets') {
                        checkWidgets(content as WidgetDefinition[]);
                    } else if (type === 'tabs') {
                        _.forEach(content as TabContent[], tab => checkWidgets(tab.widgets));
                    } else {
                        logger.warn('Unsupported layout type:', type);
                    }
                });
            }

            if (page.type === 'pageGroup') {
                _.forEach(page.pages, ({ layout }) => checkLayout(layout));
            } else {
                checkLayout(page.layout);
            }
        });
    });

    return filterUses;
}
