/**
 * Created by jakub.niezgoda on 05/02/2018.
 */

import GenericField from 'app/components/basic/GenericField';

export default class GenericConfig {
    static POLLING_TIME_CONFIG = (pollingTime = 0) => {
        return {
            id: 'pollingTime',
            name: 'Refresh time interval',
            default: pollingTime,
            placeHolder: 'Enter time interval in seconds',
            description: 'Data of the widget will be refreshed per provided interval time in seconds',
            type: GenericField.NUMBER_TYPE
        };
    };

    static PAGE_SIZE_CONFIG = (pageSize = 5) => {
        return {
            id: 'pageSize',
            default: pageSize,
            hidden: true
        };
    };

    static SORT_COLUMN_CONFIG = sortColumn => {
        return {
            id: 'sortColumn',
            default: sortColumn,
            hidden: true
        };
    };

    static SORT_ASCENDING_CONFIG = sortAscending => {
        return {
            id: 'sortAscending',
            default: sortAscending,
            hidden: true
        };
    };

    static get CATEGORY() {
        return {
            BLUEPRINTS: 'Blueprints',
            DEPLOYMENTS: 'Deployments',
            BUTTONS_AND_FILTERS: 'Buttons and Filters',
            CHARTS_AND_STATISTICS: 'Charts and Statistics',
            EXECUTIONS_NODES: 'Executions/Nodes',
            SYSTEM_RESOURCES: 'System Resources',
            SPIRE: 'Spire',
            OTHERS: 'Others',
            ALL: 'All'
        };
    }

    static get CUSTOM_WIDGET_PERMISSIONS() {
        return {
            CUSTOM_ADMIN_ONLY: 'widget_custom_admin',
            CUSTOM_SYS_ADMIN_ONLY: 'widget_custom_sys_admin',
            CUSTOM_ALL: 'widget_custom_all'
        };
    }

    static WIDGET_PERMISSION = widgetId => {
        return `widget_${widgetId}`;
    };
}
