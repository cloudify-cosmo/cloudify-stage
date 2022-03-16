// @ts-nocheck File not migrated fully to TS
import { join } from 'lodash';
import BlueprintsList from './BlueprintsList';
import type { BlueprintsWidgetConfiguration } from './types';
import BlueprintsLabelFilter from './BlueprintsLabelFilter';

const t = Stage.Utils.getT('widgets.blueprints');
const tCatalogConfiguration = Stage.Utils.getT('widgets.blueprintCatalog.configuration');

Stage.defineWidget<unknown, unknown, BlueprintsWidgetConfiguration>({
    id: 'blueprints',
    name: 'Blueprints',
    description: 'Shows blueprint list',
    initialWidth: 8,
    initialHeight: 20,
    color: 'blue',
    hasStyle: true,
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('blueprints'),
    categories: [Stage.GenericConfig.CATEGORY.BLUEPRINTS],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(5),
        {
            id: 'fieldsToShow',
            name: t('configuration.fieldsToShow.label'),
            placeHolder: t('configuration.fieldsToShow.placeholder'),
            items: ['Created', 'Updated', 'Creator', 'State', 'Deployments'].map(item =>
                t(`configuration.fieldsToShow.items.${item}`)
            ),
            default: join(
                ['Creator', 'State', 'Deployments'].map(item => t(`configuration.fieldsToShow.items.${item}`))
            ),
            type: Stage.Basic.GenericField.MULTI_SELECT_LIST_TYPE
        },
        {
            id: 'clickToDrillDown',
            name: t('configuration.clickToDrillDown'),
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'displayStyle',
            name: t('configuration.displayStyle.label'),
            items: [
                { name: t('configuration.displayStyle.items.table'), value: 'table' },
                { name: t('configuration.displayStyle.items.catalog'), value: 'catalog' }
            ],
            default: 'table',
            type: Stage.Basic.GenericField.LIST_TYPE
        },
        Stage.GenericConfig.SORT_COLUMN_CONFIG('created_at'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(false),
        {
            id: 'hideFailedBlueprints',
            name: t('configuration.hideFailedBlueprints'),
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'showComposerOptions',
            type: Stage.Basic.GenericField.BOOLEAN_TYPE,
            name: t('configuration.showComposerOptions'),
            default: false
        },
        {
            id: 'filterRules',
            name: Stage.i18n.t('widgets.blueprints.configuration.labelFilterRules'),
            default: [],
            type: Stage.Basic.GenericField.CUSTOM_TYPE,
            component: BlueprintsLabelFilter
        },
        Stage.Common.BlueprintMarketplace.tabsConfig,
        {
            id: 'marketplaceDisplayStyle',
            name: t('configuration.marketplaceDisplayStyle.label'),
            items: [
                {
                    name: t('configuration.marketplaceDisplayStyle.items.table'),
                    value: 'table'
                },
                {
                    name: t('configuration.marketplaceDisplayStyle.items.catalog'),
                    value: 'catalog'
                }
            ],
            default: 'table',
            type: Stage.Basic.GenericField.LIST_TYPE
        },
        {
            id: 'marketplaceColumnsToShow',
            name: t('configuration.marketplaceColumnsToShow.label'),
            placeholder: t('configuration.marketplaceColumnsToShow.placeholder'),
            items: [
                tCatalogConfiguration('fieldsToShow.items.name'),
                tCatalogConfiguration('fieldsToShow.items.description'),
                tCatalogConfiguration('fieldsToShow.items.created'),
                tCatalogConfiguration('fieldsToShow.items.updated')
            ],
            default: join([
                tCatalogConfiguration('fieldsToShow.items.name'),
                tCatalogConfiguration('fieldsToShow.items.description')
            ]),

            type: Stage.Basic.GenericField.MULTI_SELECT_LIST_TYPE
        }
    ],

    fetchData(widget, toolbox, params) {
        const result = {};
        const filterRules = [...(widget.configuration.filterRules || [])];
        const { SearchActions } = Stage.Common;
        const searchActions = new SearchActions(toolbox);

        if (widget.configuration.hideFailedBlueprints) {
            filterRules.push({
                key: 'state',
                values: [Stage.Common.BlueprintActions.CompletedBlueprintStates.Uploaded],
                operator: Stage.Common.Filters.FilterRuleOperators.AnyOf,
                type: Stage.Common.Filters.FilterRuleType.Attribute
            });
        }

        return searchActions
            .doListBlueprints(filterRules, {
                _include: 'id,updated_at,created_at,description,created_by,visibility,main_file_name,state,error',
                ...params
            })
            .then(data => {
                result.blueprints = data;

                return toolbox.getManager().doGetFull('/summary/deployments', {
                    _target_field: 'blueprint_id',
                    blueprint_id: _.map(data.items, item => item.id)
                });
            })
            .then(data => {
                result.deployments = data;
                return result;
            });
    },
    fetchParams: (widget, toolbox) => {
        const params = {};

        if (toolbox.getContext().getValue('onlyMyResources'))
            params.created_by = toolbox.getManager().getCurrentUsername();

        if (widget.configuration.hideFailedBlueprints) {
            const { BlueprintActions } = Stage.Common;
            params.state = BlueprintActions.CompletedBlueprintStates.Uploaded;
        }

        return params;
    },

    processData(data, toolbox) {
        const blueprintsData = data.blueprints;
        const deploymentData = data.deployments;

        // Count deployments
        const depCount = _.reduce(
            deploymentData.items,
            (result, item) => {
                result[item.blueprint_id] = item.deployments;
                return result;
            },
            {}
        );
        _.each(blueprintsData.items, blueprint => {
            blueprint.depCount = depCount[blueprint.id] || 0;
        });

        const selectedBlueprint = toolbox.getContext().getValue('blueprintId');

        return {
            ...blueprintsData,
            items: _.map(blueprintsData.items, item => {
                return {
                    ...item,
                    created_at: Stage.Utils.Time.formatTimestamp(item.created_at),
                    updated_at: Stage.Utils.Time.formatTimestamp(item.updated_at),
                    isSelected: selectedBlueprint === item.id
                };
            }),
            total: _.get(blueprintsData, 'metadata.pagination.total', 0)
        };
    },

    render(widget, data, error, toolbox) {
        const { Loading } = Stage.Basic;

        if (_.isEmpty(data)) {
            return <Loading />;
        }

        const formattedData = this.processData(data, toolbox);
        return (
            <div>
                <BlueprintsList widget={widget} data={formattedData} toolbox={toolbox} />
            </div>
        );
    }
});
