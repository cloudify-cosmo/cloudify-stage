import type { PollingTimeConfiguration } from '../../../app/utils/GenericConfig';
import type { InputItem, InputsTableProps } from './InputsTable';
import InputsTable from './InputsTable';

export interface InputsTableData {
    inputs: InputItem[];
}

Stage.defineWidget<unknown, InputsTableData, PollingTimeConfiguration>({
    id: 'inputs',
    name: Stage.i18n.t('widgets.inputs.name'),
    description: Stage.i18n.t('widgets.inputs.description'),
    initialWidth: 8,
    initialHeight: 16,
    color: 'teal',
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('inputs'),
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS],

    initialConfiguration: [Stage.GenericConfig.POLLING_TIME_CONFIG(30)],

    fetchData(_widget, toolbox) {
        const deploymentId = toolbox.getContext().getValue('deploymentId');
        const blueprintId = toolbox.getContext().getValue('blueprintId');

        if (deploymentId) {
            const deploymentInputsPromise = toolbox
                .getManager()
                .doGet(`/deployments/${deploymentId}?_include=blueprint_id,inputs`);
            const blueprintInputsPromise = deploymentInputsPromise.then(data =>
                toolbox.getManager().doGet(`/blueprints/${data.blueprint_id}?_include=plan`)
            );

            return Promise.all([deploymentInputsPromise, blueprintInputsPromise]).then(data => {
                const deploymentInputs = _.get(data[0], 'inputs', {});
                const blueprintsInputs = _.get(data[1], 'plan.inputs', {});
                return Promise.resolve({
                    inputs: _.map(deploymentInputs, (inputObject, inputName) => ({
                        name: inputName,
                        value: inputObject,
                        description: blueprintsInputs[inputName].description || ''
                    }))
                });
            });
        }

        if (blueprintId) {
            return toolbox
                .getManager()
                .doGet(`/blueprints/${blueprintId}?_include=plan`)
                .then(data => {
                    const deploymentInputs = _.get(data, 'plan.inputs', {});
                    return Promise.resolve({
                        inputs: _.map(deploymentInputs, (inputObject, inputName) => ({
                            name: inputName,
                            value: inputObject.default,
                            description: inputObject.description || ''
                        }))
                    });
                });
        }

        return Promise.resolve({ inputs: [] });
    },

    render(widget, data, _error, toolbox) {
        const { Loading } = Stage.Basic;

        if (_.isEmpty(data) || !data) {
            return <Loading />;
        }

        const formattedData: InputsTableProps['data'] = {
            ...data,
            items: data.inputs,
            deploymentId: toolbox.getContext().getValue('deploymentId'),
            blueprintId: toolbox.getContext().getValue('blueprintId')
        };

        return <InputsTable data={formattedData} toolbox={toolbox} widget={widget} />;
    }
});
