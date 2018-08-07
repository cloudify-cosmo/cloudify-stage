/**
 * Created by jakub.niezgoda on 31/07/2018.
 */

import { Component } from 'react';
import React from 'react';

class SecretsStepActions extends Component {
    static propTypes = Stage.Basic.Wizard.Step.Actions.propTypes;

    onNext(id) {
        return this.props.onLoading(id)
            .then(this.props.fetchData)
            .then(({stepData}) => this.props.onNext(id, {secrets: {..._.pickBy(stepData, (secret) => secret.status !== SecretsStepContent.defined)}}))
            .catch((error) => this.props.onError(id, error));
    }

    render() {
        let {Wizard} = Stage.Basic;
        return <Wizard.Step.Actions {...this.props} onNext={this.onNext.bind(this)} />
    }
}

class SecretsStepContent extends Component {
    constructor(props, context) {
        super(props);

        this.state = {
            secretsInManager: [],
            stepData: {}
        }
    }

    static propTypes = Stage.Basic.Wizard.Step.Content.propTypes;

    static defined = 'defined';
    static unDefined = 'unDefined';

    componentDidMount() {
        const secrets = _.get(this.props.wizardData, 'blueprint.secrets', {});

        this.props.onLoading(this.props.id)
            .then(() => this.props.toolbox.getManager().doGet('/secrets?_include=key'))
            .then((secretsInManager) => {
                secretsInManager = secretsInManager.items;
                secretsInManager = _.map(secretsInManager, (secretObject) => secretObject.key);

                let stepData = {};
                for (let secret of _.keys(secrets)) {
                    stepData[secret] = this.props.stepData[secret] || '';
                }

                return {stepData, secretsInManager};
            })
            .then((newState) => new Promise((resolve) => this.setState(newState, resolve)))
            .then(() => this.props.onChange(this.props.id, this.state.stepData))
            .catch((error) => this.props.onError(this.props.id, error))
            .finally(() => this.props.onReady(this.props.id));
    }

    getSecretStatus(secretKey) {
        const isSecretInManager = _.includes(this.state.secretsInManager, secretKey);
        let secretStatus = '';

        if (isSecretInManager) {
            secretStatus = SecretsStepContent.defined;
        } else {
            secretStatus = SecretsStepContent.unDefined;
        }

        return secretStatus;
    }

    getSecretDefined(secretKey) {
        const secretStatus = this.getSecretStatus(secretKey);
        let {Checkmark} = Stage.Basic;

        switch (secretStatus) {
            case SecretsStepContent.defined:
                return <Checkmark value={true}/>;
            case SecretsStepContent.unDefined:
            default:
                return <Checkmark value={false}/>;
        }
    }

    getSecretAction(secretKey) {
        const secretStatus = this.getSecretStatus(secretKey);
        let {Form, Icon} = Stage.Basic;

        let action = null;
        switch (secretStatus) {
            case SecretsStepContent.defined:
                action = <strong><Icon name='check circle' color='green' /> Secret defined. No action required.</strong>;
                break;
            case SecretsStepContent.unDefined:
            default:
                action = (
                    <span>
                        <strong><Icon name='warning circle' color='yellow' /> Secret not defined. Provide value:</strong>
                        &nbsp;&nbsp;
                        <Form.Input name={secretKey} value={this.state.stepData[secretKey] || ''}
                                    onChange={this.handleChange.bind(this)} />
                    </span>
                );
        }

        return action;
    }

    handleChange(event, {name, value}) {
        this.setState({stepData: {...this.state.stepData, [name]: value}},
            () => this.props.onChange(this.props.id, this.state.stepData));
    }

    render() {
        let {Table, Wizard} = Stage.Basic;
        const secrets = _.get(this.props.wizardData, 'blueprint.secrets', {});

        return (
            <Wizard.Step.Content {...this.props}>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Secret</Table.HeaderCell>
                            <Table.HeaderCell>Defined</Table.HeaderCell>
                            <Table.HeaderCell>Action</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {
                            _.map(_.keys(secrets), (secretKey) =>
                                <Table.Row key={secretKey}>
                                    <Table.Cell>{secretKey}</Table.Cell>
                                    <Table.Cell textAlign='center' width={1}>{this.getSecretDefined(secretKey)}</Table.Cell>
                                    <Table.Cell>{this.getSecretAction(secretKey)}</Table.Cell>
                                </Table.Row>
                            )
                        }
                    </Table.Body>
                </Table>
            </Wizard.Step.Content>
        );
    }
}

export default Stage.Basic.Wizard.Utils.createWizardStep('secrets', 'Secrets', 'Define secrets', SecretsStepContent, SecretsStepActions);
