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
            .then(({stepData}) => {
                const {JsonUtils} = Stage.Common;

                const undefinedSecrets = _.chain(stepData)
                    .pickBy((secret) => secret.status === SecretsStepContent.statusUndefined)
                    .mapValues((secretData) => secretData.value)
                    .value();

                const secretsWithoutValue = _.chain(stepData)
                    .pickBy((secret) => secret.status === SecretsStepContent.statusUndefined && _.isEmpty(secret.value))
                    .keys()
                    .value();

                if (secretsWithoutValue.length > 0) {
                    return Promise.reject(`No values for the following secrets: ${JsonUtils.getStringValue(secretsWithoutValue)}`);
                } else {
                    return this.props.onNext(id, {secrets: undefinedSecrets});
                }
            })
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

        this.state = SecretsStepContent.initialState(props);
    }

    static propTypes = Stage.Basic.Wizard.Step.Content.propTypes;

    static statusUnknown = 0;
    static statusDefined = 1;
    static statusUndefined = 2;
    static defaultSecretState = {value: '', status: SecretsStepContent.statusUnknown};
    static dataPath = 'blueprint.secrets';

    static initialState = (props) => ({
        secretsInManager: [],
        stepData: _.mapValues(
            _.get(props.wizardData, SecretsStepContent.dataPath, {}),
            (secretData, secretKey) => ({...props.stepData[secretKey] || SecretsStepContent.defaultSecretState})
        )
    });

    static getSecretStatus(secretKey, secretsInManager) {
        if (_.includes(secretsInManager, secretKey)) {
            return SecretsStepContent.statusDefined;
        } else {
            return SecretsStepContent.statusUndefined;
        }
    }

    componentDidMount() {
        const secrets = _.get(this.props.wizardData, SecretsStepContent.dataPath, {});

        this.props.onLoading(this.props.id)
            .then(() => this.props.toolbox.getManager().doGet('/secrets?_include=key'))
            .then((secretsInManager) => {
                secretsInManager = secretsInManager.items;
                secretsInManager = _.map(secretsInManager, (secretObject) => secretObject.key);

                let stepData = {};
                for (let secret of _.keys(secrets)) {
                    stepData[secret] = this.props.stepData[secret] || {value: '', status: SecretsStepContent.statusUndefined};
                    stepData[secret].status = SecretsStepContent.getSecretStatus(secret, secretsInManager);
                }

                return {stepData, secretsInManager};
            })
            .then((newState) => new Promise((resolve) => this.setState(newState, resolve)))
            .then(() => this.props.onChange(this.props.id, this.state.stepData))
            .catch((error) => this.props.onError(this.props.id, error))
            .finally(() => this.props.onReady(this.props.id));
    }

    getSecretDefined(secretKey) {
        let {Checkmark} = Stage.Basic;
        let secret = this.state.stepData[secretKey];

        switch (secret.status) {
            case SecretsStepContent.statusDefined:
                return <Checkmark value={true}/>;
            case SecretsStepContent.statusUndefined:
            default:
                return <Checkmark value={false}/>;
        }
    }

    getSecretAction(secretKey) {
        let {Form, Icon} = Stage.Basic;
        let secret = this.state.stepData[secretKey];

        switch (secret.status) {
            case SecretsStepContent.statusDefined:
                return <strong><Icon name='check circle' color='green' /> Secret defined. No action required.</strong>
            case SecretsStepContent.statusUndefined:
            default:
                return (
                    <span>
                        <strong><Icon name='warning circle' color='yellow' /> Secret not defined. Provide value:</strong>
                        &nbsp;&nbsp;
                        <Form.Input name={secretKey} value={secret.value}
                                    onChange={this.handleChange.bind(this)} />
                    </span>
                );
        }
    }

    handleChange(event, {name, value}) {
        let secret = this.state.stepData[name];
        secret.value = value;
        this.setState({stepData: {...this.state.stepData, [name]: secret}},
            () => this.props.onChange(this.props.id, this.state.stepData));
    }

    render() {
        let {Table, Wizard} = Stage.Basic;
        const secrets = _.get(this.props.wizardData, SecretsStepContent.dataPath, {});

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
