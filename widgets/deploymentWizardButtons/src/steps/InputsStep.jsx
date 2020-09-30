/**
 * Created by jakub.niezgoda on 31/07/2018.
 */

import StepActions from '../wizard/StepActions';
import { createWizardStep } from '../wizard/wizardUtils';
import NoResourceMessage from './helpers/NoResourceMessage';
import ResourceStatus from './helpers/ResourceStatus';
import StepContentPropTypes from './StepContentPropTypes';

const inputsStepId = 'inputs';

class InputsStepActions extends React.Component {
    static inputsDataPath = 'blueprint.inputs';

    constructor(props) {
        super(props);
    }

    onNext = id => {
        const { fetchData, onError, onLoading, onNext, wizardData } = this.props;
        const { InputsUtils } = Stage.Common;

        return onLoading()
            .then(fetchData)
            .then(({ stepData }) => {
                const inputsWithoutValues = {};
                const blueprintInputsPlan = _.get(wizardData, InputsStepActions.inputsDataPath, {});
                const deploymentInputs = InputsUtils.getInputsToSend(
                    blueprintInputsPlan,
                    stepData,
                    inputsWithoutValues
                );

                if (!_.isEmpty(inputsWithoutValues)) {
                    return Promise.reject({
                        message: `Provide values for the following inputs: ${_.keys(inputsWithoutValues).join(', ')}`,
                        errors: inputsWithoutValues
                    });
                }
                return onNext(id, { inputs: { ...deploymentInputs } });
            })
            .catch(error => onError(id, error.message, error.errors));
    };

    render() {
        const {
            onClose,
            onStartOver,
            onPrev,
            onError,
            onLoading,
            onReady,
            disabled,
            showPrev,
            fetchData,
            wizardData,
            toolbox,
            id
        } = this.props;
        return (
            <StepActions
                id={id}
                onClose={onClose}
                onStartOver={onStartOver}
                onPrev={onPrev}
                onError={onError}
                onLoading={onLoading}
                onReady={onReady}
                disabled={disabled}
                showPrev={showPrev}
                fetchData={fetchData}
                wizardData={wizardData}
                toolbox={toolbox}
                onNext={this.onNext}
            />
        );
    }
}

InputsStepActions.propTypes = StepActions.propTypes;

class InputsStepContent extends React.Component {
    static inputsDataPath = 'blueprint.inputs';

    static dataTypesDataPath = 'blueprint.dataTypes';

    constructor(props) {
        super(props);

        this.state = {
            fileLoading: false
        };
    }

    componentDidMount() {
        const { id, onChange, stepData: stepDataProp, wizardData } = this.props;
        const inputs = _.get(wizardData, InputsStepContent.inputsDataPath, {});
        const dataTypes = _.get(wizardData, InputsStepContent.dataTypesDataPath, {});

        const stepData = _.mapValues(inputs, (inputData, inputName) => {
            if (!_.isUndefined(stepDataProp[inputName])) {
                return stepDataProp[inputName];
            }
            const dataType =
                !_.isEmpty(dataTypes) && !!inputs[inputName].type ? dataTypes[inputs[inputName].type] : undefined;
            return Stage.Common.InputsUtils.getInputFieldInitialValue(inputData.default, inputData.type, dataType);
        });
        onChange(id, { ...stepData });
    }

    getInputStatus(defaultValue) {
        if (_.isNil(defaultValue)) {
            return (
                <ResourceStatus
                    status={ResourceStatus.actionRequired}
                    text="Input has no default value defined. Please provide value."
                />
            );
        }
        return (
            <ResourceStatus
                status={ResourceStatus.noActionRequired}
                text="Input has default value defined. No action required."
            />
        );
    }

    handleYamlFileChange = file => {
        const { id, onChange, onError, stepData, toolbox, wizardData } = this.props;
        if (!file) {
            return;
        }

        const { FileActions, InputsUtils } = Stage.Common;
        const actions = new FileActions(toolbox);
        this.setState({ fileLoading: true });

        actions
            .doGetYamlFileContent(file)
            .then(yamlInputs => {
                const plan = _.get(wizardData, InputsStepContent.inputsDataPath, {});
                const deploymentInputs = InputsUtils.getUpdatedInputs(plan, stepData, yamlInputs);
                onChange(id, { ...deploymentInputs });
                this.setState({ fileLoading: false });
            })
            .catch(err => {
                const errorMessage = `Loading values from YAML file failed: ${_.isString(err) ? err : err.message}`;
                onError(id, errorMessage, { yamlFile: errorMessage });
                this.setState({ fileLoading: false });
            });
    };

    handleInputChange(event, field) {
        const { id, onChange, stepData } = this.props;
        onChange(id, { ...stepData, ...Stage.Basic.Form.fieldNameValue(field) });
    }

    render() {
        const { Divider, Form, Table } = Stage.Basic;
        const { DataTypesButton, InputsUtils, InputsHeader, YamlFileButton } = Stage.Common;
        const { errors, loading, stepData, wizardData } = this.props;
        const { fileLoading } = this.state;

        const inputs = _.get(wizardData, InputsStepContent.inputsDataPath, {});
        const dataTypes = _.get(wizardData, InputsStepContent.dataTypesDataPath, {});
        const noInputs = _.isEmpty(inputs);

        return (
            <Form loading={loading} success={noInputs}>
                {noInputs ? (
                    <NoResourceMessage resourceName="inputs" />
                ) : (
                    <div>
                        <YamlFileButton
                            onChange={this.handleYamlFileChange}
                            dataType="deployment's inputs"
                            fileLoading={fileLoading}
                        />
                        {!_.isEmpty(dataTypes) && <DataTypesButton types={dataTypes} />}
                        <Divider hidden style={{ clear: 'both' }} />
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Input</Table.HeaderCell>
                                    <Table.HeaderCell colSpan="2">
                                        <InputsHeader header="Value" dividing={false} />
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {_.map(_.keys(stepData), inputName => {
                                    if (!_.isNil(inputs[inputName])) {
                                        const dataType =
                                            !_.isEmpty(dataTypes) && !!inputs[inputName].type
                                                ? dataTypes[inputs[inputName].type]
                                                : undefined;
                                        const help = InputsUtils.getHelp(
                                            inputs[inputName].description,
                                            inputs[inputName].type,
                                            inputs[inputName].constraints,
                                            inputs[inputName].default,
                                            dataType
                                        );
                                        return (
                                            <Table.Row key={inputName} name={inputName}>
                                                <Table.Cell collapsing>
                                                    <Form.Field key={inputName} help={help} label={inputName} />
                                                </Table.Cell>
                                                <Table.Cell collapsing>
                                                    {this.getInputStatus(inputs[inputName].default)}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {InputsUtils.getInputField(
                                                        inputName,
                                                        stepData[inputName],
                                                        inputs[inputName].default,
                                                        this.handleInputChange.bind(this),
                                                        errors[inputName],
                                                        inputs[inputName].type,
                                                        inputs[inputName].constraints
                                                    )}
                                                </Table.Cell>
                                            </Table.Row>
                                        );
                                    }
                                    return null;
                                })}
                            </Table.Body>
                        </Table>
                    </div>
                )}
            </Form>
        );
    }
}

InputsStepContent.propTypes = StepContentPropTypes;

export default createWizardStep(inputsStepId, 'Inputs', 'Provide inputs', InputsStepContent, InputsStepActions);
