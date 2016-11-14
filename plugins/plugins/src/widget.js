/**
 * Created by kinneretzin on 07/09/2016.
 */

import PluginsTable from './PluginsTable';
import renderUploadPluginModal from './UploadPluginModal';

var UploadModal = null;

Stage.addPlugin({
    id: "plugins",
    name: "Plugins list",
    description: 'blah blah blah',
    initialWidth: 8,
    initialHeight: 5,
    color : "blue",
    isReact: true,
    init: function(pluginUtils) {
        UploadModal = renderUploadPluginModal(pluginUtils);
    },

    fetchData: function(plugin,context,pluginUtils) {
        return new Promise( (resolve,reject) => {
            pluginUtils.jQuery.get({
                url: context.getManagerUrl('/api/v2.1/plugins?_include=id,package_name,package_version,supported_platform,distribution,distribution_release,uploaded_at'),
                dataType: 'json'
                })
                .done((plugins)=> {resolve(plugins);})
                .fail(reject)
        });
    },

    render: function(widget,data,error,context,pluginUtils) {

        if (_.isEmpty(data)) {
            return pluginUtils.renderReactLoading();
        }

        var selectedPlugin = context.getValue('pluginId');
        var formattedData = Object.assign({},data,{
            items: _.map (data.items,(item)=>{
                return Object.assign({},item,{
                    uploaded_at: pluginUtils.moment(item.uploaded_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'), //2016-07-20 09:10:53.103579
                    isSelected: selectedPlugin === item.id
                })
            })
        });

        return (
            <div>
                <PluginsTable widget={widget} data={formattedData} context={context} utils={pluginUtils}/>
                <UploadModal widget={widget} data={formattedData} context={context} utils={pluginUtils}/>
            </div>
        );
    }
});