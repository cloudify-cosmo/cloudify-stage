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
    initialConfiguration: {filter_by: ""},
    isReact: true,
    init: function(pluginUtils) {
        UploadModal = renderUploadBlueprintModal(pluginUtils);
    },

    fetchData: function(plugin,context,pluginUtils) {
        return new Promise( (resolve,reject) => {
            pluginUtils.jQuery.get({
                url: context.getManagerUrl() + '/api/v2.1/blueprints?_include=id,updated_at,created_at,description,plan',
                dataType: 'json'
                })
                .done((blueprints)=> {

                    pluginUtils.jQuery.get({
                        url: context.getManagerUrl() + '/api/v2.1/deployments?_include=id,blueprint_id',
                        dataType: 'json'
                        })
                        .done((deployments)=>{

                            var depCount = _.countBy(deployments.items,'blueprint_id');
                            // Count deployments
                            _.each(blueprints.items,(blueprint)=>{
                                blueprint.depCount = depCount[blueprint.id] || 0;

                            });

                            resolve(blueprints);
                        })
                        .fail(reject);
                })
                .fail(reject)
        });
    },


    render: function(widget,data,error,context,pluginUtils) {

        if (!data) {
            return pluginUtils.renderReactLoading();
        }

        if (error) {
            return pluginUtils.renderReactError(error);
        }

        var selectedBlueprint = context.getValue('blueprintId');
        var formattedData = Object.assign({},data,{
            items: _.map (data.items,(item)=>{
                return Object.assign({},item,{
                    created_at: pluginUtils.moment(item.created_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'), //2016-07-20 09:10:53.103579
                    updated_at: pluginUtils.moment(item.updated_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'),
                    isSelected: selectedBlueprint === item.id
                })
            })
        });

        return (
            <div>
                <BlueprintsTable widget={widget} data={formattedData} context={context} utils={pluginUtils}/>
                <UploadModal widget={widget} data={formattedData} context={context} utils={pluginUtils}/>
                <DeployModal widget={widget} data={formattedData} context={context} utils={pluginUtils}/>
            </div>
        );
    }
});