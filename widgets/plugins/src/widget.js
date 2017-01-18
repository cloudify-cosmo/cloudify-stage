/**
 * Created by kinneretzin on 07/09/2016.
 */

import PluginsTable from './PluginsTable';

Stage.defineWidget({
    id: "plugins",
    name: "Plugins list",
    description: 'Plugins list',
    initialWidth: 8,
    initialHeight: 5,
    color : "blue",
    isReact: true,
    initialConfiguration: [
        {id: "pollingTime", default: 30}
    ],
    fetchUrl: '[manager]/plugins?_include=id,package_name,package_version,supported_platform,distribution,distribution_release,uploaded_at[params]',
    pageSize: 5,

    render: function(widget,data,error,toolbox) {

        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        var selectedPlugin = toolbox.getContext().getValue('pluginId');
        var formattedData = Object.assign({},data,{
            items: _.map (data.items,(item)=>{
                return Object.assign({},item,{
                    uploaded_at: moment(item.uploaded_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'), //2016-07-20 09:10:53.103579
                    isSelected: selectedPlugin === item.id
                })
            })
        });
        formattedData.total =  _.get(data, "metadata.pagination.total", 0);

        return (
            <PluginsTable widget={widget} data={formattedData} toolbox={toolbox}/>
        );
    }
});