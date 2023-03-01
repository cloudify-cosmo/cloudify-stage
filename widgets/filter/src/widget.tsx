import StageUtils from 'app/utils/stageUtils';
import Filter from './Filter';

export type FilterWidgetConfiguration = { allowMultipleSelection: boolean };

const translate = StageUtils.getT('widgets.filter');
const translateColumn = Stage.Utils.composeT(translate, 'columns');

Stage.defineWidget<never, never, FilterWidgetConfiguration>({
    id: 'filter',
    name: translate('name'),
    description: translate('description'),
    initialWidth: 12,
    initialHeight: 3,
    showHeader: false,
    showBorder: false,
    categories: [Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('filter'),
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        {
            id: 'filterByBlueprints',
            name: translateColumn('showBlueprintFilter'),
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'filterByDeployments',
            name: translateColumn('showDeploymentFilter'),
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'filterByExecutions',
            name: translateColumn('showExecutionFilter'),
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        { id: 'filterByNodes', name: 'Show node filter', default: false, type: Stage.Basic.GenericField.BOOLEAN_TYPE },
        {
            id: 'filterByNodeInstances',
            name: translateColumn('showNodeInstanceFilter'),
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'filterByExecutionsStatus',
            name: translateColumn('showExecutionStatusFilter'),
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'filterBySiteName',
            name: translateColumn('showSiteNameFilter'),
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'allowMultipleSelection',
            name: translateColumn('allowMultipleSelection'),
            description: translateColumn('allowMultipleSelectionDescription'),
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        }
    ],

    render(widget, _data, _error, toolbox) {
        return <Filter configuration={widget.configuration} toolbox={toolbox} />;
    }
});
