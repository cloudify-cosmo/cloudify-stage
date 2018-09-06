/**
 * Created by jakub.niezgoda on 31/07/2018.
 */

import React, { Component } from 'react';

import ResourceStatus from './helpers/ResourceStatus';
import ResourceAction from './helpers/ResourceAction';
import NoResourceMessage from './helpers/NoResourceMessage';

const secretsStepId = 'secrets';
const {createWizardStep} = Stage.Basic.Wizard.Utils;

class SecretsStepActions extends Component {
    static propTypes = Stage.Basic.Wizard.Step.Actions.propTypes;

    onNext(id) {
        return this.props.onLoading()
            .then(this.props.fetchData)
            .then(({stepData}) => {
                const undefinedSecrets = _.chain(stepData)
                    .pickBy((secret) => secret.status === SecretsStepContent.statusUndefined)
                    .value();

                const secretsWithoutValue = _.chain(stepData)
                    .pickBy((secret) => secret.status === SecretsStepContent.statusUndefined && _.isEmpty(secret.value))
                    .keys()
                    .value();

                if (secretsWithoutValue.length > 0) {
                    return Promise.reject(`Provide values for the following secrets: ${secretsWithoutValue.join(', ')}`);
                } else {
                    return this.props.onNext(id, {secrets: undefinedSecrets});
                }
            })
            .catch((error) => this.props.onError(error));
    }

    render() {
        let {Wizard} = Stage.Basic;
        return <Wizard.Step.Actions {...this.props} onNext={this.onNext.bind(this)} />
    }
}

class SecretsStepContent extends Component {
    constructor(props) {
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

    componentDidMount() {
        const secrets = _.get(this.props.wizardData, SecretsStepContent.dataPath, {});

        this.props.onLoading()
            .then(() => this.props.toolbox.getManager().doGet('/secrets?_include=key,visibility'))
            .then((secretsInManager) => {
                secretsInManager = secretsInManager.items;
                secretsInManager = _.reduce(secretsInManager, (result, secretObject) => {
                    result[secretObject.key] = {
                        visibility: secretObject.visibility
                    };
                    return result;
                }, {});

                let stepData = {};
                for (let secret of _.keys(secrets)) {
                    stepData[secret] = this.props.stepData[secret] || {
                        value: '',
                        visibility: Stage.Common.Consts.defaultVisibility,
                        status: SecretsStepContent.statusUndefined
                    };

                    if (_.includes(_.keys(secretsInManager), secret)) {
                        stepData[secret].status = SecretsStepContent.statusDefined;
                        stepData[secret].visibility = secretsInManager[secret].visibility;
                    } else {
                        stepData[secret].status = SecretsStepContent.statusUndefined;
                    }
                }

                return {stepData, secretsInManager};
            })
            .then((newState) => new Promise((resolve) => this.setState(newState, resolve)))
            .then(() => this.props.onChange(this.props.id, this.state.stepData))
            .catch((error) => this.props.onError(error))
            .finally(() => this.props.onReady());
    }

    getSecretStatus(secretKey) {
        let secret = this.state.stepData[secretKey];

        switch (secret.status) {
            case SecretsStepContent.statusDefined:
                return <ResourceStatus status={ResourceStatus.noActionRequired}
                                       text='Secret defined.' />;
            case SecretsStepContent.statusUndefined:
                return <ResourceStatus status={ResourceStatus.actionRequired}
                                       text='Secret not defined. Please provide value for the secret.' />;
            default:
                return <ResourceStatus status={ResourceStatus.unknown}
                                       text='Unknown status. Internal error.' />;
        }
    }

    getSecretAction(secretKey) {
        let {Form} = Stage.Basic;
        let secret = this.state.stepData[secretKey];

        switch (secret.status) {
            case SecretsStepContent.statusDefined:
                return <ResourceAction>No action required.</ResourceAction>;
            case SecretsStepContent.statusUndefined:
                return (
                    <ResourceAction>
                        <Form.Input name={secretKey} value={secret.value} fluid
                                    onChange={(event, {name, value}) => this.handleChange(name, 'value', value)} />
                    </ResourceAction>
                );
            default:
                return null;
        }
    }

    getSecretVisibility(secretKey) {
        let {VisibilityField} = Stage.Basic;
        let secret = this.state.stepData[secretKey];

        switch (secret.status) {
            case SecretsStepContent.statusDefined:
                return (
                    <ResourceAction>
                        <VisibilityField visibility={secret.visibility} className='large' allowChange={false} />
                    </ResourceAction>
                );
            case SecretsStepContent.statusUndefined:
                return (
                    <ResourceAction>
                        <VisibilityField visibility={secret.visibility} className='large'
                                         onVisibilityChange={(visibility) => this.handleChange(secretKey, 'visibility', visibility)} />
                    </ResourceAction>
                );
            default:
                return null;
        }
    }

    handleChange(secretKey, fieldName, fieldValue) {
        let secret = this.state.stepData[secretKey];
        secret[fieldName] = fieldValue;
        this.setState({stepData: {...this.state.stepData, [secretKey]: secret}},
            () => this.props.onChange(this.props.id, this.state.stepData));
    }

    render() {
        let {Form, Table} = Stage.Basic;
        const secrets = _.get(this.props.wizardData, SecretsStepContent.dataPath, {});
        const noSecrets = _.isEmpty(secrets);

        return (
            <Form loading={this.props.loading} success={noSecrets}>
                {
                    noSecrets
                    ?
                        <NoResourceMessage resourceName='secrets' />
                    :
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Secret</Table.HeaderCell>
                                    <Table.HeaderCell colSpan='3'>Action</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {
                                    _.map(_.keys(secrets), (secretKey) =>
                                        <Table.Row key={secretKey}>
                                            <Table.Cell collapsing>{secretKey}</Table.Cell>
                                            <Table.Cell collapsing>{this.getSecretStatus(secretKey)}</Table.Cell>
                                            <Table.Cell>{this.getSecretAction(secretKey)}</Table.Cell>
                                            <Table.Cell collapsing>{this.getSecretVisibility(secretKey)}</Table.Cell>
                                        </Table.Row>
                                    )
                                }
                            </Table.Body>
                        </Table>
                }
            </Form>
        );
    }
}

export default createWizardStep(secretsStepId,
                                'Secrets',
                                'Define secrets',
                                SecretsStepContent,
                                SecretsStepActions);
