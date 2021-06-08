/**
 * Created by jakub.niezgoda on 31/07/2018.
 */

import StepActions from '../wizard/StepActions';
import { createWizardStep } from '../wizard/wizardUtils';
import NoResourceMessage from './helpers/NoResourceMessage';
import ResourceAction from './helpers/ResourceAction';
import ResourceStatus from './helpers/ResourceStatus';
import StepContentPropTypes from './StepContentPropTypes';

const secretsStepId = 'secrets';

const secretStatuses = {
    unknown: 0,
    defined: 1,
    undefined: 2
};

function SecretsStepActions({
    onClose,
    onStartOver,
    onPrev,
    onNext,
    onError,
    onLoading,
    onReady,
    disabled,
    showPrev,
    fetchData,
    wizardData,
    toolbox,
    id
}) {
    function handleNext(stepId) {
        return onLoading()
            .then(fetchData)
            .then(({ stepData }) => {
                const undefinedSecrets = _.chain(stepData)
                    .pickBy(secret => secret.status === secretStatuses.undefined)
                    .value();

                const secretsWithoutValue = _.chain(stepData)
                    .pickBy(secret => secret.status === secretStatuses.undefined && _.isEmpty(secret.value))
                    .mapValues(() => true)
                    .value();

                if (!_.isEmpty(secretsWithoutValue)) {
                    return Promise.reject({
                        message: `Provide values for the following secrets: ${_.keys(secretsWithoutValue).join(', ')}`,
                        errors: secretsWithoutValue
                    });
                }
                return onNext(stepId, { secrets: undefinedSecrets });
            })
            .catch(error => onError(stepId, error.message, error.errors));
    }

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
            onNext={handleNext}
        />
    );
}

SecretsStepActions.propTypes = StepActions.propTypes;

class SecretsStepContent extends React.Component {
    static defaultSecretState = {
        value: '',
        visibility: Stage.Common.Consts.defaultVisibility,
        status: secretStatuses.unknown
    };

    static dataPath = 'blueprint.secrets';

    static initialState = {};

    constructor(props) {
        super(props);

        this.state = SecretsStepContent.initialState;
    }

    componentDidMount() {
        const { id, onChange, onError, onLoading, onReady, toolbox, stepData: stepDataProp, wizardData } = this.props;
        const secrets = _.get(wizardData, SecretsStepContent.dataPath, {});

        onLoading()
            .then(() => toolbox.getManager().doGet('/secrets?_include=key,visibility'))
            .then(secretsInManager => {
                let formattedSecretsInManager = secretsInManager.items;
                formattedSecretsInManager = _.reduce(
                    formattedSecretsInManager,
                    (result, secretObject) => {
                        result[secretObject.key] = {
                            visibility: secretObject.visibility
                        };
                        return result;
                    },
                    {}
                );

                const stepData = {};
                _.forEach(_.keys(secrets), secret => {
                    stepData[secret] = stepDataProp[secret] || { ...SecretsStepContent.defaultSecretState };

                    if (_.includes(_.keys(formattedSecretsInManager), secret)) {
                        stepData[secret].status = secretStatuses.defined;
                        stepData[secret].visibility = formattedSecretsInManager[secret].visibility;
                    } else {
                        stepData[secret].status = secretStatuses.undefined;
                    }
                });

                return stepData;
            })
            .then(
                stepData =>
                    new Promise(resolve => {
                        onChange(id, stepData);
                        resolve();
                    })
            )
            .catch(error => onError(id, error))
            .finally(() => onReady());
    }

    handleChange(secretKey, fieldName, fieldValue) {
        const { id, onChange, stepData } = this.props;
        const secret = { ...stepData[secretKey] };
        secret[fieldName] = fieldValue;

        onChange(id, { ...stepData, [secretKey]: secret });
    }

    getSecretStatus(secretKey) {
        const { stepData } = this.props;
        const secret = stepData[secretKey];

        switch (secret.status) {
            case secretStatuses.defined:
                return <ResourceStatus status={ResourceStatus.noActionRequired} text="Secret defined." />;
            case secretStatuses.undefined:
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
            case secretStatuses.defined:
                return <ResourceAction>No action required.</ResourceAction>;
            case secretStatuses.undefined:
                return (
                    <ResourceAction>
                        <Form.Input
                            name={secretKey}
                            value={secret.value}
                            error={errors[secretKey]}
                            fluid
                            placeholder="Provide secret value"
                            onChange={(event, { value }) => this.handleChange(secretKey, 'value', value)}
                        />
                    </ResourceAction>
                );
            default:
                return null;
        }
    }

    getSecretVisibility(secretKey) {
        const { VisibilityField } = Stage.Basic;
        const { stepData } = this.props;
        const secret = stepData[secretKey];

        switch (secret.status) {
            case secretStatuses.defined:
                return (
                    <ResourceAction>
                        <VisibilityField visibility={secret.visibility} className="large" allowChange={false} />
                    </ResourceAction>
                );
            case secretStatuses.undefined:
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

SecretsStepContent.propTypes = StepContentPropTypes;

export default createWizardStep(secretsStepId, 'Secrets', 'Define secrets', SecretsStepContent, SecretsStepActions);
