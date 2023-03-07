import i18n from 'i18next';
import { GenericField } from '../components/basic';
import type { WidgetConfigurationDefinition } from './StageAPI';

export default class GenericConfig {
    static POLLING_TIME_CONFIG = (pollingTime = 0): WidgetConfigurationDefinition => {
        return {
            id: 'pollingTime',
            name: i18n.t('widget.config.pollingTime.name'),
            default: pollingTime,
            placeHolder: i18n.t('widget.config.pollingTime.placeholder'),
            description: i18n.t('widget.config.pollingTime.description'),
            type: GenericField.NUMBER_TYPE,
            min: 0
        };
    };

    static PAGE_SIZE_CONFIG = (pageSize = 5): WidgetConfigurationDefinition => {
        return {
            id: 'pageSize',
            default: pageSize,
            hidden: true,
            type: GenericField.NUMBER_TYPE
        };
    };

    static SORT_COLUMN_CONFIG = (sortColumn: string): WidgetConfigurationDefinition => {
        return {
            id: 'sortColumn',
            default: sortColumn,
            hidden: true,
            type: GenericField.STRING_TYPE
        };
    };

    static SORT_ASCENDING_CONFIG = (sortAscending: boolean): WidgetConfigurationDefinition => {
        return {
            id: 'sortAscending',
            default: sortAscending,
            hidden: true,
            type: GenericField.STRING_TYPE
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
        } as const;
    }

    static get CUSTOM_WIDGET_PERMISSIONS() {
        return {
            CUSTOM_ADMIN_ONLY: 'widget_custom_admin',
            CUSTOM_SYS_ADMIN_ONLY: 'widget_custom_sys_admin',
            CUSTOM_ALL: 'widget_custom_all'
        } as const;
    }

    static WIDGET_PERMISSION = (widgetId: string) => {
        return `widget_${widgetId}`;
    };
}

export interface PollingTimeConfiguration {
    pollingTime: number;
}

export interface PageSizeConfiguration {
    pageSize: number;
}

export interface SortColumnConfiguration {
    sortColumn: string;
}

export interface SortAscendingConfiguration {
    sortAscending: boolean;
}

export type DataTableConfiguration = PageSizeConfiguration & SortColumnConfiguration & SortAscendingConfiguration;
