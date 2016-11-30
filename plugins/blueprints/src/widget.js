/**
 * Created by kinneretzin on 07/09/2016.
 */

import BlueprintsTable from './BlueprintsTable';
import renderUploadBlueprintModal from './UploadBlueprintModal';
import DeployModal from './CreateDeploymentModal';

var UploadModal = null;

Stage.addPlugin({
    id: "blueprints",
    name: "Blueprints list",
    description: 'blah blah blah',
    initialWidth: 8,
    initialHeight: 5,
    color : "blue",
    isReact: true,
    initialConfiguration: [
        {id: "pollingTime", default: 2}
    ],
    init: function(pluginUtils) {
        UploadModal = renderUploadBlueprintModal(pluginUtils);
    },

    fetchUrl: [
        '[manager]/api/v2.1/blueprints?_include=id,updated_at,created_at,description',
        '[manager]/api/v2.1/deployments?_include=id,blueprint_id'
    ],

    _processData(data,context,pluginUtils) {
        var blueprintsData = data[0];
        var deploymentData = data[1];
        var depCount = _.countBy(deploymentData.items,'blueprint_id');
        // Count deployments
        _.each(blueprintsData.items,(blueprint)=>{
            blueprint.depCount = depCount[blueprint.id] || 0;
        });

        var selectedBlueprint = context.getValue('blueprintId');
        var formattedData = Object.assign({},blueprintsData,{
            items: _.map (blueprintsData.items,(item)=>{
                return Object.assign({},item,{
                    created_at: pluginUtils.moment(item.created_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'), //2016-07-20 09:10:53.103579
                    updated_at: pluginUtils.moment(item.updated_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'),
                    isSelected: selectedBlueprint === item.id
                })
            })
        });

        return formattedData;
    },
    render: function(widget,data,error,context,pluginUtils) {

        if (_.isEmpty(data)) {
            return pluginUtils.renderReactLoading();
        }

        var formattedData = this._processData(data,context,pluginUtils);
        return (
            <div>
                <BlueprintsTable widget={widget} data={formattedData} context={context} utils={pluginUtils}/>
                <UploadModal widget={widget} data={formattedData} context={context} utils={pluginUtils}/>
                <DeployModal widget={widget} data={formattedData} context={context} utils={pluginUtils}/>
            </div>
        );
    }
});