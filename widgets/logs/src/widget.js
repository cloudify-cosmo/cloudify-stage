/**
 * Created by kinneretzin on 07/09/2016.
 */

import LogsTable from './LogsTable';

Stage.defineWidget({
    id: 'logs',
    name: "Deployment Logs",
    description: '',
    initialWidth: 5,
    initialHeight: 4,
    color: "purple",
    fetchUrl: '[manager]/events',
    isReact: true,
    initialConfiguration: [
        {id: "pollingTime", default: 2}
    ],

    render: function(widget,data,error,toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        var formattedData = Object.assign({},data,{
            items: _.filter(data.items,(item)=>{return item.type === 'cloudify_log';}) // Can maybe change to item.level !== undefined
        });
        var deploymentId = toolbox.getContext().getValue('deploymentId');
        var blueprintId = toolbox.getContext().getValue('blueprintId');
        var executionId = toolbox.getContext().getValue('executionId');

        if (executionId) {
            formattedData.items = _.filter(formattedData.items, (item)=> {
                return item.context.execution_id === executionId;
            });
        } else if (deploymentId) {
            formattedData.items = _.filter(formattedData.items,(item)=>{
                return item.context.deployment_id === deploymentId;
            });
        } else if (blueprintId) {
            formattedData.items = _.filter(formattedData.items,(item)=>{
                return item.context.blueprint_id === blueprintId;
            });
        }

        var index=0;
        formattedData = Object.assign({},formattedData,{
            items: _.map (formattedData.items,(item)=>{
                return Object.assign({},item,{
                    id: index++,
                    timestamp: moment(item.timestamp,'YYYY-MM-DD HH:mm:ss.SSS+SSS').format('DD-MM-YYYY HH:mm') //2016-07-20 09:10:53.103+000
                })
            })
        });

        formattedData.blueprintId = blueprintId;
        formattedData.deploymentId = deploymentId;
        formattedData.executionId = executionId;

        return (
            <LogsTable widget={widget} data={formattedData} toolbox={toolbox}/>
        );

    }
});