/**
 * Created by jakub.niezgoda on 31/07/2018.
 */

import React, { Component } from 'react';

import ResourceStatus from './helpers/ResourceStatus';

class InputsStepActions extends Component {
    static propTypes = Stage.Basic.Wizard.Step.Actions.propTypes;

    static dataPath = 'blueprint.inputs';

    onNext(id) {
        const {DeployBlueprintModal, JsonUtils} = Stage.Common;

        return this.props.onLoading(id)
            .then(this.props.fetchData)
            .then(({stepData, wizardData}) => {
                let deploymentInputs = {};
                let inputsWithoutValues = [];

                _.forEach(_.get(wizardData, InputsStepActions.dataPath, {}), (inputObj, inputName) => {
                    let stringInputValue = stepData[inputName];
                    let typedInputValue = JsonUtils.getTypedValue(stringInputValue);

                    if (_.isEmpty(stringInputValue)) {
                        if (_.isNil(inputObj.default)) {
                            inputsWithoutValues.push(inputName);
                        }
                    } else if (stringInputValue === DeployBlueprintModal.EMPTY_STRING) {
                        deploymentInputs[inputName] = '';
                    } else if (!_.isEqual(typedInputValue, inputObj.default)) {
                        deploymentInputs[inputName] = typedInputValue;
                    }
                });

                if (!_.isEmpty(inputsWithoutValues)) {
                    return Promise.reject(`Provide values for the following inputs: ${inputsWithoutValues.join(', ')}`);
                } else {
                    return this.props.onNext(id, {inputs: {...deploymentInputs}})
                }
            })
            .catch((error) => this.props.onError(id, error));
    }

    render() {
        let {Wizard} = Stage.Basic;
        return <Wizard.Step.Actions {...this.props} onNext={this.onNext.bind(this)} />
    }
}

class InputsStepContent extends Component {
    constructor(props) {
        super(props);

        this.state = InputsStepContent.initialState(props);
    }

    static propTypes = Stage.Basic.Wizard.Step.Content.propTypes;

    static defaultInputValue = '';
    static dataPath = 'blueprint.inputs';

    static initialState = (props) => ({
        errors: {},
        stepData: _.mapValues(
            _.get(props.wizardData, InputsStepContent.dataPath, {}),
            (inputData, inputName) => props.stepData[inputName] ||
                Stage.Common.JsonUtils.getStringValue(inputData.default) ||
                InputsStepContent.defaultInputValue
        )
    });

    componentDidMount() {
        this.props.onChange(this.props.id, this.state.stepData);
    }

    handleChange(event, {name, value}) {
        this.setState({stepData: {...this.state.stepData, [name]: value}},
            () => this.props.onChange(this.props.id, this.state.stepData));
    }

    getInputStatus(defaultValue) {
        if (_.isNil(defaultValue)) {
            return <ResourceStatus status={ResourceStatus.actionRequired} text='Input has no default value defined. Please provide value.' />;
        } else {
            return <ResourceStatus status={ResourceStatus.noActionRequired} text='Input has default value defined. No action required.' />;
        }
    }

    render() {
        let {Form, Table, Wizard} = Stage.Basic;

        const inputs = _.get(this.props.wizardData, InputsStepContent.dataPath, {});

        const ResetToDefaultIcon = (props) => {
            let {Icon} = Stage.Basic;
            let {JsonUtils} = Stage.Common;

            const isDefaultValueDefined = !_.isNil(props.defaultValue);
            const isValueTheSameAsDefaultValue = _.isEqual(JsonUtils.getTypedValue(props.value), props.defaultValue);
            const resetToDefault = (event, inputName, defaultValue) =>
                this.handleChange(event, {name: inputName, value: JsonUtils.getStringValue(defaultValue)});

            return isDefaultValueDefined && !isValueTheSameAsDefaultValue
                ? <Icon name='refresh' link aria-label='Reset to default value'
                        onClick={(event) => resetToDefault(event, props.inputName, props.defaultValue)} />
                : null;
        };

        return (
            <Wizard.Step.Content {...this.props}>
                <Table celled definition>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell textAlign='center' width={1} />
                            <Table.HeaderCell width={4}>Input</Table.HeaderCell>
                            <Table.HeaderCell width={12}>Value</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {
                            _.map(_.keys(inputs), (inputName) =>
                                <Table.Row key={inputName}>
                                    <Table.Cell>
                                        {this.getInputStatus(inputName, inputs[inputName].default)}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Form.Field key={inputName} error={this.state.errors[inputName]}
                                                    help={inputs[inputName].description}
                                                    label={inputName}
                                                    required={_.isNil(inputs[inputName].default)}>
                                        </Form.Field>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Form.Input name={inputName} fluid
                                                    icon={<ResetToDefaultIcon inputName={inputName}
                                                                              value={this.state.stepData[inputName]}
                                                                              defaultValue={inputs[inputName].default} />}
                                                    value={this.state.stepData[inputName]}
                                                    onChange={this.handleChange.bind(this)} />
                                    </Table.Cell>
                                </Table.Row>
                            )
                        }
                    </Table.Body>
                </Table>
                {

                }
            </Wizard.Step.Content>
        );
    }
}

export default Stage.Basic.Wizard.Utils.createWizardStep('inputs', 'Inputs', 'Provide inputs', InputsStepContent, InputsStepActions);