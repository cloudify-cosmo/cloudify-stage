/**
 * Created by jakub.niezgoda on 31/07/2018.
 */

import ResourceStatus from './helpers/ResourceStatus';
import ResourceAction from './helpers/ResourceAction';
import NoResourceMessage from './helpers/NoResourceMessage';
import { createWizardStep } from '../wizard/wizardUtils';
import StepActions from '../wizard/StepActions';
import StepContent from '../wizard/StepContent';

const secretsStepId = 'secrets';

class SecretsStepActions extends React.Component {
    static propTypes = StepActions.propTypes;

    onNext(id) {
        const { fetchData, onError, onLoading, onNext } = this.props;
        return onLoading()
            .then(fetchData)
            .then(({ stepData }) => {
                const undefinedSecrets = _.chain(stepData)
                    .pickBy(secret => secret.status === SecretsStepContent.statusUndefined)
                    .value();

                const secretsWithoutValue = _.chain(stepData)
                    .pickBy(secret => secret.status === SecretsStepContent.statusUndefined && _.isEmpty(secret.value))
                    .mapValues(() => true)
                    .value();

                if (!_.isEmpty(secretsWithoutValue)) {
                    return Promise.reject({
                        message: `Provide values for the following secrets: ${_.keys(secretsWithoutValue).join(', ')}`,
                        errors: secretsWithoutValue
                    });
                }
                return onNext(id, { secrets: undefinedSecrets });
            })
            .catch(error => onError(id, error.message, error.errors));
    }

    render() {
        const { Wizard } = Stage.Basic;
        return <StepActions {...this.props} onNext={this.onNext.bind(this)} />;
    }
}

class SecretsStepContent extends React.Component {
    constructor(props) {
        super(props);

        this.state = SecretsStepContent.initialState;
    }

    static propTypes = StepContent.propTypes;

    static statusUnknown = 0;

    static statusDefined = 1;

    static statusUndefined = 2;

    static defaultSecretState = {
        value: '',
        visibility: Stage.Common.Consts.defaultVisibility,
        status: SecretsStepContent.statusUnknown
    };

    static dataPath = 'blueprint.secrets';

    static initialState = {
        secretsInManager: []
    };

    componentDidMount() {
        const { id, onChange, onError, onLoading, onReady, toolbox, wizardData } = this.props;
        const secrets = _.get(wizardData, SecretsStepContent.dataPath, {});

        onLoading()
            .then(() => toolbox.getManager().doGet('/secrets?_include=key,visibility'))
            .then(secretsInManager => {
                secretsInManager = secretsInManager.items;
                secretsInManager = _.reduce(
                    secretsInManager,
                    (result, secretObject) => {
                        result[secretObject.key] = {
                            visibility: secretObject.visibility
                        };
                        return result;
                    },
                    {}
                );

                const stepData = {};
                for (const secret of _.keys(secrets)) {
                    stepData[secret] = stepData[secret] || { ...SecretsStepContent.defaultSecretState };

                    if (_.includes(_.keys(secretsInManager), secret)) {
                        stepData[secret].status = SecretsStepContent.statusDefined;
                        stepData[secret].visibility = secretsInManager[secret].visibility;
                    } else {
                        stepData[secret].status = SecretsStepContent.statusUndefined;
                    }
                }

                return { stepData, secretsInManager };
            })
            .then(
                ({ stepData, secretsInManager }) =>
                    new Promise(resolve =>
                        this.setState({ secretsInManager }, () => {
                            onChange(id, stepData);
                            resolve();
                        })
                    )
            )
            .catch(error => onError(id, error))
            .finally(() => onReady());
    }

    getSecretStatus(secretKey) {
        const secret = this.props.stepData[secretKey];

        switch (secret.status) {
            case SecretsStepContent.statusDefined:
                return <ResourceStatus status={ResourceStatus.noActionRequired} text="Secret defined." />;
            case SecretsStepContent.statusUndefined:
                return (
                    <ResourceStatus
                        status={ResourceStatus.actionRequired}
                        text="Secret not defined. Please provide value for the secret."
                    />
                );
            default:
                return <ResourceStatus status={ResourceStatus.unknown} text="Unknown status. Internal error." />;
        }
    }

    getSecretAction(secretKey) {
        const { errors, stepData } = this.props;
        const { Form } = Stage.Basic;
        const secret = stepData[secretKey];

        switch (secret.status) {
            case SecretsStepContent.statusDefined:
                return <ResourceAction>No action required.</ResourceAction>;
            case SecretsStepContent.statusUndefined:
                return (
                    <ResourceAction>
                        <Form.Input
                            name={secretKey}
                            value={secret.value}
                            error={errors[secretKey]}
                            fluid
                            placeholder="Provide secret value"
                            onChange={(event, { name, value }) => this.handleChange(secretKey, 'value', value)}
                        />
                    </ResourceAction>
                );
            default:
                return null;
        }
    }

    getSecretVisibility(secretKey) {
        const { VisibilityField } = Stage.Basic;
        const secret = this.props.stepData[secretKey];

        switch (secret.status) {
            case SecretsStepContent.statusDefined:
                return (
                    <ResourceAction>
                        <VisibilityField visibility={secret.visibility} className="large" allowChange={false} />
                    </ResourceAction>
                );
            case SecretsStepContent.statusUndefined:
                return (
                    <ResourceAction>
                        <VisibilityField
                            visibility={secret.visibility}
                            className="large"
                            onVisibilityChange={visibility => this.handleChange(secretKey, 'visibility', visibility)}
                        />
                    </ResourceAction>
                );
            default:
                return null;
        }
    }

    handleChange(secretKey, fieldName, fieldValue) {
        const { id, onChange, stepData } = this.props;
        const secret = { ...stepData[secretKey] };
        secret[fieldName] = fieldValue;

        onChange(id, { ...stepData, [secretKey]: secret });
    }

    render() {
        const { loading, stepData, wizardData } = this.props;
        const { Form, Table } = Stage.Basic;
        const secrets = _.get(wizardData, SecretsStepContent.dataPath, {});
        const noSecrets = _.isEmpty(secrets);

        return (
            <Form loading={loading} success={noSecrets}>
                {noSecrets ? (
                    <NoResourceMessage resourceName="secrets" />
                ) : (
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Secret</Table.HeaderCell>
                                <Table.HeaderCell colSpan="3">Action</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {_.map(
                                _.keys(stepData),
                                secretKey =>
                                    !_.isNil(secrets[secretKey]) && (
                                        <Table.Row key={secretKey} name={secretKey}>
                                            <Table.Cell collapsing>{secretKey}</Table.Cell>
                                            <Table.Cell collapsing>{this.getSecretStatus(secretKey)}</Table.Cell>
                                            <Table.Cell>{this.getSecretAction(secretKey)}</Table.Cell>
                                            <Table.Cell collapsing>{this.getSecretVisibility(secretKey)}</Table.Cell>
                                        </Table.Row>
                                    )
                            )}
                        </Table.Body>
                    </Table>
                )}
            </Form>
        );
    }
}

export default createWizardStep(secretsStepId, 'Secrets', 'Define secrets', SecretsStepContent, SecretsStepActions);
