import { get, join, reduce } from 'lodash';
import BlueprintsList from './BlueprintsList';
import type { Blueprint, BlueprintsWidgetConfiguration } from './types';
import './widget.css';
import { translateBlueprints } from './widget.utils';

const fields = ['Created', 'Updated', 'Creator', 'State', 'Deployments'];

interface Deployment {
    // eslint-disable-next-line camelcase
    blueprint_id: string;
    deployments: number;
}

interface BlueprintsWidgetData {
    blueprints: Stage.Types.PaginatedResponse<Blueprint>;
    deployments: Stage.Types.PaginatedResponse<Deployment>;
}

interface BlueprintsParams {
    // eslint-disable-next-line camelcase
    created_by?: string;
    state?: string;
}

const processData = (data: BlueprintsWidgetData, toolbox: Stage.Types.Toolbox) => {
    const blueprintsData = data.blueprints;
    const deploymentData = data.deployments;

    // Count deployments
    const depCount = reduce(
        deploymentData.items,
        (result: Record<string, number>, item: Deployment) => {
            result[item.blueprint_id] = item.deployments;
            return result;
        },
        {}
    );

    const selectedBlueprint = toolbox.getContext().getValue('blueprintId');

    return {
        ...blueprintsData,
        items: blueprintsData.items.map(item => ({
            ...item,
            created_at: Stage.Utils.Time.formatTimestamp(item.created_at),
            updated_at: Stage.Utils.Time.formatTimestamp(item.updated_at),
            depCount: depCount[item.id] || 0,
            isSelected: selectedBlueprint === item.id
        })),
        total: get(blueprintsData, 'metadata.pagination.total', 0)
    };
};

Stage.defineWidget<BlueprintsParams, BlueprintsWidgetData, BlueprintsWidgetConfiguration>({
    id: 'blueprints',
    initialWidth: 8,
    initialHeight: 20,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('blueprints'),
    categories: [Stage.GenericConfig.CATEGORY.BLUEPRINTS],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(5),
        {
            id: 'fieldsToShow',
            name: translateBlueprints('configuration.fieldsToShow.label'),
            placeHolder: translateBlueprints('configuration.fieldsToShow.placeholder'),
            items: fields.map(item => translateBlueprints(`configuration.fieldsToShow.items.${item}`)),
            default: join(fields.map(item => translateBlueprints(`configuration.fieldsToShow.items.${item}`))),
            type: Stage.Basic.GenericField.MULTI_SELECT_LIST_TYPE
        },
        {
            id: 'clickToDrillDown',
            name: translateBlueprints('configuration.clickToDrillDown'),
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'displayStyle',
            name: translateBlueprints('configuration.displayStyle.label'),
            items: [
                { name: translateBlueprints('configuration.displayStyle.items.table'), value: 'table' },
                { name: translateBlueprints('configuration.displayStyle.items.catalog'), value: 'catalog' }
            ],
            default: 'table',
            type: Stage.Basic.GenericField.LIST_TYPE
        },
        Stage.GenericConfig.SORT_COLUMN_CONFIG('created_at'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(false),
        {
            id: 'hideFailedBlueprints',
            name: translateBlueprints('configuration.hideFailedBlueprints'),
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'showComposerOptions',
            type: Stage.Basic.GenericField.BOOLEAN_TYPE,
            name: translateBlueprints('configuration.showComposerOptions'),
            default: true
        },
        {
            id: 'filterRules',
            name: translateBlueprints('configuration.labelFilterRules'),
            default: [],
            type: Stage.Basic.GenericField.CUSTOM_TYPE,
            component: Stage.Common.Blueprints.LabelFilter
        }
    ],

    async fetchData(widget, toolbox, params) {
        const result: BlueprintsWidgetData = {
            blueprints: { items: [], metadata: { pagination: { offset: 0, size: 0, total: 0 } } },
            deployments: { items: [], metadata: { pagination: { offset: 0, size: 0, total: 0 } } }
        };
        const filterRules = [...(widget.configuration.filterRules || [])];
        const SearchActions = Stage.Common.Actions.Search;
        const searchActions = new SearchActions(toolbox);

        if (widget.configuration.hideFailedBlueprints) {
            filterRules.push({
                key: 'state',
                values: [Stage.Common.Blueprints.CompletedStates.Uploaded],
                operator: Stage.Common.Filters.FilterRuleOperators.AnyOf,
                type: Stage.Common.Filters.FilterRuleType.Attribute
            });
        }

        const blueprints = await searchActions.doListBlueprints<keyof Blueprint>({
            filterRules,
            params: {
                _include: 'id,updated_at,created_at,description,created_by,visibility,main_file_name,state,error',
                ...params
            }
        });

        result.blueprints = blueprints;

        const deployments = await toolbox.getManager().doGetFull<Deployment>('/summary/deployments', {
            _target_field: 'blueprint_id',
            blueprint_id: _.map(blueprints.items, item => item.id)
        });

        result.deployments = deployments;

        return result;
    },

    fetchParams: (widget, toolbox) => {
        const params: BlueprintsParams = {};

        if (toolbox.getContext().getValue('onlyMyResources'))
            params.created_by = toolbox.getManager().getCurrentUsername();

        if (widget.configuration.hideFailedBlueprints) {
            params.state = Stage.Common.Blueprints.CompletedStates.Uploaded;
        }

        return params;
    },

    render(widget, data, _error, toolbox) {
        const { Loading } = Stage.Basic;

        if (Stage.Utils.isEmptyWidgetData(data)) {
            return <Loading />;
        }

        const formattedData = processData(data, toolbox);

        return (
            <div>
                <BlueprintsList widget={widget} data={formattedData} toolbox={toolbox} />
            </div>
        );
    }
});
