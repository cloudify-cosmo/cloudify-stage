/**
 * Created by pawelposel on 07/11/2016.
 */

import InputsTable from './InputsTable';

Stage.defineWidget({
    id: 'inputs',
    name: 'Deployment Inputs',
    description: 'This widget shows the deployment inputs',
    initialWidth: 8,
    initialHeight: 16,
    color : "teal",
    isReact: true,
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(2)
    ],

    fetchData: function(widget,toolbox) {
        let deploymentId = toolbox.getContext().getValue('deploymentId');
        let blueprintId = toolbox.getContext().getValue('blueprintId');

        if (deploymentId) {
            let deploymentInputsPromise = toolbox.getManager().doGet(`/deployments/${deploymentId}?_include=blueprint_id,inputs`)
            let blueprintInputsPromise = deploymentInputsPromise.then(data => toolbox.getManager().doGet(`/blueprints/${data.blueprint_id}?_include=plan`));

            return Promise.all([deploymentInputsPromise, blueprintInputsPromise])
                .then(data => {
                    let deploymentInputs = _.get(data[0], 'inputs', {});
                    let blueprintsInputs = _.get(data[1], 'plan.inputs', {});
                    return Promise.resolve({
                        inputs: _.map(deploymentInputs, (inputObject, inputName) => (
                            {
                                name: inputName,
                                value: inputObject,
                                description: blueprintsInputs[inputName].description || ''
                            })
                        )
                    });
                });
        }

        if (blueprintId) {
            return toolbox.getManager().doGet(`/blueprints/${blueprintId}?_include=plan`)
                .then(data => {
                    let deploymentInputs = _.get(data, 'plan.inputs', {});
                    return Promise.resolve({
                        inputs: _.map(deploymentInputs, (inputObject, inputName) => (
                            {
                                name: inputName,
                                value: inputObject.default,
                                description: inputObject.description || ''
                            })
                        )
                    })
                })
        };

        return Promise.resolve({inputs:[]});
    },

    render: function(widget,data,error,toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        let formattedData = Object.assign({},data,{
            items: data.inputs,
            deploymentId : toolbox.getContext().getValue('deploymentId'),
            blueprintId : toolbox.getContext().getValue('blueprintId')
        });

        return (
            <InputsTable data={formattedData} toolbox={toolbox} widget={widget} />
        );
    }
});