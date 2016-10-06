/**
 * Created by kinneretzin on 07/09/2016.
 */

addPlugin({
    id: 'events',
    name: "Deployment Events",
    description: '',
    initialWidth: 5,
    initialHeight: 4,
    color: "green",
    fetchUrl: '/plugins/events/data.json',
    render: function(widget,data,error,context,pluginUtils) {
        if (!widget.plugin.template) {
            return 'Events: missing template';
        }

        var formattedData = Object.assign({},data);
        var deploymentId = context.getValue('deploymentId');
        if (deploymentId) {
            formattedData.items = _.filter(data.items,(item)=>{
                return item.context.deployment_id === deploymentId;
            });
        }

        formattedData = Object.assign({},formattedData,{
            items: _.map (formattedData.items,(item)=>{
                return Object.assign({},item,{
                    timestamp: pluginUtils.moment(item.timestamp,'YYYY-MM-DD HH:mm:ss.SSS+SSS').format('DD-MM-YYYY HH:mm') //2016-07-20 09:10:53.103+000
                })
            })
        });

        formattedData.deploymentId = context.getValue('deploymentId');
        return pluginUtils.buildFromTemplate(widget.plugin.template,formattedData);

    }
});