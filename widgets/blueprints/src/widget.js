/**
 * Created by kinneretzin on 07/09/2016.
 */

import BlueprintsList from './BlueprintsList';

Stage.defineWidget({
    id: "blueprints",
    name: "Blueprints",
    description: 'Shows blueprint list',
    initialWidth: 8,
    initialHeight: 20,
    color : "blue",
    hasStyle: true,
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('blueprints'),
    categories: [Stage.GenericConfig.CATEGORY.BLUEPRINTS],
    
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(5),
        {id: "clickToDrillDown", name: "Enable click to drill down", default: true, type: Stage.Basic.GenericField.BOOLEAN_TYPE},
        {id: "displayStyle",name: "Display style", items: [{name:'Table', value:'table'}, {name:'Catalog', value:'catalog'}],
            default: "table", type: Stage.Basic.GenericField.LIST_TYPE},
        Stage.GenericConfig.SORT_COLUMN_CONFIG('created_at'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(false)
    ],

    fetchData(widget,toolbox,params) {
        var result = {};
        return toolbox.getManager().doGet('/blueprints?_include=id,updated_at,created_at,description,created_by,visibility,main_file_name',params)
            .then(data=>{
                result.blueprints = data;

                return toolbox.getManager().doGetFull('/summary/deployments', {
                    _target_field: 'blueprint_id',
                    blueprint_id: _.map(data.items, item => item.id)
                });
            })
            .then(data=>{
                result.deployments = data;
                return result;
            });
    },
    fetchParams: (widget, toolbox) => 
        toolbox.getContext().getValue('onlyMyResources') ? {created_by: toolbox.getManager().getCurrentUsername()} : {},

    _processData(data,toolbox) {
        let blueprintsData = data.blueprints;
        let deploymentData = data.deployments;

        // Count deployments
        const depCount = _.reduce(deploymentData.items, (result, item) => {
            result[item.blueprint_id] = item.deployments;
            return result;
        }, {});
        _.each(blueprintsData.items, (blueprint) => {
            blueprint.depCount = depCount[blueprint.id] || 0;
        });

        const selectedBlueprint = toolbox.getContext().getValue('blueprintId');

        return Object.assign({}, blueprintsData, {
            items: _.map(blueprintsData.items,(item) => {
                return Object.assign({}, item, {
                    created_at: Stage.Utils.formatTimestamp(item.created_at),
                    updated_at: Stage.Utils.formatTimestamp(item.updated_at),
                    isSelected: selectedBlueprint === item.id
                })
            }),
            total: _.get(blueprintsData, 'metadata.pagination.total', 0)
        });
    },

    render: function(widget,data,error,toolbox) {

        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        var formattedData = this._processData(data,toolbox);
        return (
            <div>
                <BlueprintsList widget={widget} data={formattedData} toolbox={toolbox}/>
            </div>
        );
    }
});