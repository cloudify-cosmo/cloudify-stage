import Filter from './Filter';
import type { FilterConfiguration } from './types';

const widgetId = 'filter';
const translate = Stage.Utils.getT(`widgets.${widgetId}`);

Stage.defineWidget<never, never, FilterConfiguration>({
    id: widgetId,
    initialWidth: 12,
    initialHeight: 3,
    showHeader: false,
    showBorder: false,
    categories: [Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION(widgetId),
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        {
            id: 'filterByBlueprints',
            name: translate('configuration.filterByBlueprints'),
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'filterByDeployments',
            name: translate('configuration.filterByDeployments'),
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'filterByExecutions',
            name: translate('configuration.filterByExecutions'),
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'filterByNodes',
            name: translate('configuration.filterByNodes'),
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'filterByNodeInstances',
            name: translate('configuration.filterByNodeInstances'),
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'filterByExecutionsStatus',
            name: translate('configuration.filterByExecutionsStatus'),
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'filterBySiteName',
            name: translate('configuration.filterBySiteName'),
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'allowMultipleSelection',
            name: translate('configuration.allowMultipleSelection.name'),
            description: translate('configuration.allowMultipleSelection.description'),
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        }
    ],

    render(widget, _data, _error, toolbox) {
        return <Filter configuration={widget.configuration} toolbox={toolbox} />;
    }
});
