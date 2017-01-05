/**
 * Created by kinneretzin on 07/09/2016.
 */

import BlueprintsTable from './BlueprintsTable';

Stage.addPlugin({
    id: "blueprints",
    name: "Blueprints catalog",
    description: 'Shows a blueprints catalog',
    initialWidth: 8,
    initialHeight: 5,
    color : "blue",
    isReact: true,
    initialConfiguration: [
        {id: "pollingTime", default: 2}
    ],
    fetchUrl: [
        '[manager]/blueprints?_include=id,updated_at,created_at,description[params]',
        '[manager]/deployments?_include=id,blueprint_id'
    ],
    pageSize: 5,

    _processData(data,toolbox) {
        var blueprintsData = data[0];
        var deploymentData = data[1];
        var depCount = _.countBy(deploymentData.items,'blueprint_id');
        // Count deployments
        _.each(blueprintsData.items,(blueprint)=>{
            blueprint.depCount = depCount[blueprint.id] || 0;
        });

        var selectedBlueprint = toolbox.getContext().getValue('blueprintId');
        var formattedData = Object.assign({},blueprintsData,{
            items: _.map (blueprintsData.items,(item)=>{
                return Object.assign({},item,{
                    created_at: moment(item.created_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'), //2016-07-20 09:10:53.103579
                    updated_at: moment(item.updated_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'),
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
                <BlueprintsTable widget={widget} data={formattedData} toolbox={toolbox}/>
            </div>
        );
    }
});