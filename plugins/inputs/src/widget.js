/**
 * Created by pawelposel on 07/11/2016.
 */

import InputsTable from './InputsTable';

Stage.addPlugin({
    id: 'inputs',
    name: 'Deployment Inputs',
    description: 'This plugin shows the deployment inputs',
    initialWidth: 8,
    initialHeight: 4,
    color : "teal",
    isReact: true,

    fetchData: function(plugin,context,pluginUtils) {
        let deploymentId = context.getValue('deploymentId');

        if (deploymentId) {
            return context.getManager().doGet(`/deployments?_include=id,inputs&id=${deploymentId}`)
                .then(data=>Promise.resolve({inputs: _.get(data, "items[0].inputs", {})}));
        }
        return Promise.resolve({inputs:{}});
    },

    render: function(widget,data,error,context,pluginUtils) {
        if (_.isEmpty(data)) {
            return pluginUtils.renderReactLoading();
        }

        let formattedData = Object.assign({},data,{
            items: Object.keys(data.inputs).map(function(key) {
                return {name: key, value: data.inputs[key]};
                }),
            deploymentId : context.getValue('deploymentId')
        });

        return (
            <InputsTable data={formattedData} context={context}/>
        );
    }
});