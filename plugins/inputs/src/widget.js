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

        return new Promise( (resolve,reject) => {
            if (deploymentId) {
                $.get({
                    url: context.getManagerUrl(`/api/v2.1/deployments?_include=id,inputs&id=${deploymentId}`),
                    dataType: 'json',
                    headers: context.getSecurityHeaders()
                }).done((data)=> {
                    //for selected deployemntId there should be only one item including all inputs
                    resolve({inputs: _.get(data, "items[0].inputs", {})});
                }).fail(reject)
            } else {
                resolve({inputs:{}});
            }
        });
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