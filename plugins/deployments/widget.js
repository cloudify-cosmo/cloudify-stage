/**
 * Created by kinneretzin on 07/09/2016.
 */

addPlugin({
    id: "deployments",
    name: 'Blueprint deployments',
    description: 'blah blah blah',
    initialWidth: 8,
    initialHeight: 6,
    color : "purple",
    fetchUrl: '/plugins/deployments/data.json',
    render: function(plugin,data,context,pluginUtils) {

        if (!plugin.template) {
            return 'deployments: missing template';
        }

        var formattedData = Object.assign({},data);
        var blueprintId = context.getValue('blueprintId');
        if (blueprintId) {
            formattedData.items = _.filter(data.items,{blueprint_id:blueprintId});
        }

        formattedData = Object.assign({},formattedData,{
            items: _.map (formattedData.items,(item)=>{
                return Object.assign({},item,{
                    created_at: pluginUtils.moment(item.created_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'), //2016-07-20 09:10:53.103579
                    updated_at: pluginUtils.moment(item.updated_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm')
                })
            })
        });

        formattedData.blueprintId = blueprintId;

        return pluginUtils.buildFromTemplate(plugin.template,formattedData);
    }
});
