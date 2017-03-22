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
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(2),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        {id: "clickToDrillDown", name: "Should click to drilldown", default: true, type: Stage.Basic.GenericField.BOOLEAN_TYPE},
        {id: "displayStyle",name: "Display style", items: [{name:'Table', value:'table'}, {name:'Catalog', value:'catalog'}],
            default: "table", type: Stage.Basic.GenericField.LIST_TYPE},
        Stage.GenericConfig.SORT_COLUMN_CONFIG('created_at'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(false)
    ],

    fetchData(widget,toolbox,params) {
        var result = {};
        return toolbox.getManager().doGet('/blueprints?_include=id,updated_at,created_at,description',params)
            .then(data=>{
                result.blueprints = data;
                var blueprintIds = data.items.map(item=>item.id);

                return this._fetchDeploymentData(toolbox,blueprintIds,{items:[]},0);
            })
            .then(data=>{
                result.deployments = data;
                return result;
            });
    },

    /**
     * We need to grab the deployment full data to group by blueprint id. I minimize the list according to blueprint Id but that is sometimes not enough.
     * The manager limits the max fetch to 1000 so in case of 1 blueprint with 2000 deployments, it wont work. It will attempt to fetch 2000 and will fail because
     * its over the max size.
     * So this is a fix specifically here (although it can happen in other places for example deployment instances having size over 1000... ) but this case actaully happened.
     * This method basicaly fetches teh full data in pages, and return only after it got all the data.
     */
    _fetchDeploymentData(toolbox,blueprintIds,fullData,size) {

        var pr = toolbox.getManager().doGet(`/deployments?_include=id,blueprint_id&_size=1000&_offset=${size}`,{blueprint_id: blueprintIds});

        return pr.then(data=>{
            size += data.items.length;
            fullData.items = _.concat(fullData.items,data.items);
            var total = _.get(data, "metadata.pagination.total");

            if (total > size) {
                return this._fetchDeploymentData(toolbox,blueprintIds,fullData,size);
            } else {
                return fullData;
            }
        });
    },

    _processData(data,toolbox) {
        var blueprintsData = data.blueprints;
        var deploymentData = data.deployments;

      var depCount = _.countBy(deploymentData.items,'blueprint_id');
        // Count deployments
        _.each(blueprintsData.items,(blueprint)=>{
            blueprint.depCount = depCount[blueprint.id] || 0;
        });

        var selectedBlueprint = toolbox.getContext().getValue('blueprintId');
        var formattedData = Object.assign({},blueprintsData,{
            items: _.map (blueprintsData.items,(item)=>{
                return Object.assign({},item,{
                    created_at: Stage.Utils.formatTimestamp(item.created_at),
                    updated_at: Stage.Utils.formatTimestamp(item.updated_at),
                    isSelected: selectedBlueprint === item.id
                })
            }),
            total: _.get(blueprintsData, "metadata.pagination.total", 0)
        });

        return formattedData;
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