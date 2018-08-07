/**
 * Created by jakub.niezgoda on 31/07/2018.
 */

import { Component } from 'react';
import React from 'react';

class InputsStepActions extends Component {
    static propTypes = Stage.Basic.Wizard.Step.Actions.propTypes;

    onNext(id) {
        return this.props.onLoading(id)
            .then(this.props.fetchData)
            .then(({stepData}) => this.props.onNext(id, {inputs: {...stepData}}))
            .catch((error) => this.props.onError(id, error));
    }

    render() {
        let {Wizard} = Stage.Basic;
        return <Wizard.Step.Actions {...this.props} onNext={this.onNext.bind(this)} />
    }
}

class InputsStepContent extends Component {
    constructor(props, context) {
        super(props);

        this.state = {
            stepData: {},
            errors: {}
        }
    }

    static propTypes = Stage.Basic.Wizard.Step.Content.propTypes;


    componentDidMount() {
        const inputs = _.get(this.props.wizardData, 'blueprint.inputs', {});

        this.props.onLoading(this.props.id)
            .then(() => {
                let stepData = {};
                for (let input of _.keys(inputs)) {
                    stepData[input] = this.props.stepData[input] || '';
                }
                return {stepData};
            })
            .then((newState) => new Promise((resolve) => this.setState(newState, resolve)))
            .then(() => this.props.onChange(this.props.id, this.state.stepData))
            .catch((error) => this.props.onError(this.props.id, error))
            .finally(() => this.props.onReady(this.props.id));
    }

    handleChange(event, {name, value}) {
        this.setState({stepData: {...this.state.stepData, [name]: value}},
            () => this.props.onChange(this.props.id, this.state.stepData));
    }

    render() {
        let {Form, Wizard} = Stage.Basic;
        let {getStringValue} = Stage.Common.JsonUtils;

        const inputs = _.get(this.props.wizardData, 'blueprint.inputs', {});

        return (
            <Wizard.Step.Content {...this.props}>
                {
                    _.map(_.keys(inputs), (inputName) =>
                        <Form.Field key={inputName} error={this.state.errors[inputName]} help={inputs[inputName].description}
                                    label={inputName} required={_.isNil(inputs[inputName].default)}>
                            <Form.Input name={inputName} placeholder={getStringValue(inputs[inputName].default || '')}
                                        value={this.state.stepData[inputName]}
                                        onChange={this.handleChange.bind(this)} />
                        </Form.Field>
                    )
                }
            </Wizard.Step.Content>
        );
    }
}

export default Stage.Basic.Wizard.Utils.createWizardStep('inputs', 'Inputs', 'Provide inputs', InputsStepContent, InputsStepActions);