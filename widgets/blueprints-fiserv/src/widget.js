import BlueprintsList from './BlueprintsList';

Stage.defineWidget({
    id: 'blueprints-fiserv',
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
            id: 'clickToDrillDown',
            name: 'Enable click to drill down',
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'properties',
            name: 'Properties JSON',
            default: JSON.stringify(
                {
                    blueprintA: {
                        propertyA: {
                            valueA1: {
                                propertyB: {
                                    valueB1: { propertyC: ['valueC1', 'valueC2', 'valueC3'] },
                                    valueB2: { propertyC: ['valueC1', 'valueC2', 'valueC3'] }
                                }
                            },
                            valueA2: {
                                propertyB: {
                                    valueB3: { propertyC: ['valueC5', 'valueC4', 'valueC3'] },
                                    valueB4: { propertyC: ['valueC1', 'valueC6', 'valueC9'] }
                                }
                            }
                        }
                    },
                    blueprintB: {
                        propertyA: {
                            valueA1: {
                                propertyB: {
                                    valueB1: { propertyC: ['valueC1', 'valueC2', 'valueC3'] },
                                    valueB2: { propertyC: ['valueC1', 'valueC2', 'valueC3'] }
                                }
                            }
                        }
                    }
                },
                null,
                4
            ),
            type: Stage.Basic.GenericField.CUSTOM_TYPE,
            component: Stage.Basic.Form.Json
        },
        Stage.GenericConfig.SORT_COLUMN_CONFIG('created_at'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(false)
    ],

    fetchData(widget, toolbox, params) {
        const result = {};
        return toolbox
            .getManager()
            .doGet(
                '/blueprints?_include=id,updated_at,created_at,description,created_by,visibility,main_file_name',
                params
            )
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
    fetchParams: (widget, toolbox) =>
        toolbox.getContext().getValue('onlyMyResources')
            ? { created_by: toolbox.getManager().getCurrentUsername() }
            : {},

    _processData(data, toolbox) {
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
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading />;
        }

        const formattedData = this._processData(data, toolbox);
        return (
            <div>
                <BlueprintsList widget={widget} data={formattedData} toolbox={toolbox} />
            </div>
        );
    }
});
