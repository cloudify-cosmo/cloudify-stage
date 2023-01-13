import React from 'react';

import { Modal } from '../../../basic';
import EnvironmentsStep from './steps/EnvironmentsStep';
import SecretsStep from './steps/SecretsStep';
import SummaryStep from './steps/SummaryStep';
import WelcomeStep from './steps/WelcomeStep';
import { StepName } from './model';

import type {
    GettingStartedData,
    GettingStartedSchema,
    GettingStartedSecretsData,
    GettingStartedEnvironmentsData,
    GettingStartedSchemaItem
} from './model';
import type { Errors } from './GettingStartedModal';

type Props = {
    stepName: StepName;
    secretsStepsSchemas: GettingStartedSchemaItem[];
    secretsStepsData: GettingStartedData;
    secretsStepIndex: number;
    summaryStepSchemas: GettingStartedSchemaItem[];
    schema: GettingStartedSchema;
    onEnvironmentsStepChange: (environments: GettingStartedEnvironmentsData) => void;
    onSecretsStepChange: (secrets: GettingStartedSecretsData) => void;
    onInstallationStarted: () => void;
    onInstallationFinished: () => void;
    onInstallationCanceled: () => void;
    errors: Errors;
};

const ModalContent = ({
    stepName,
    secretsStepsSchemas,
    secretsStepsData,
    secretsStepIndex,
    summaryStepSchemas,
    schema,
    onEnvironmentsStepChange,
    onSecretsStepChange,
    onInstallationStarted,
    onInstallationFinished,
    onInstallationCanceled,
    errors
}: Props) => {
    const secretsStepSchema = secretsStepsSchemas[secretsStepIndex];
    const secretsStepData = secretsStepsData[secretsStepSchema?.name];
    const statusStepActive = stepName === StepName.Status;
    const secretsStepPageDescription = secretsStepSchema?.secretsPageDescription;

    const { Message } = Stage.Basic;

    return (
        <Modal.Content style={{ minHeight: 220, flexDirection: 'column' }}>
            {stepName === StepName.Welcome && <WelcomeStep welcomeText={schema.welcomeText} />}
            {stepName === StepName.Environments && (
                <EnvironmentsStep schema={schema} onChange={onEnvironmentsStepChange} />
            )}
            {stepName === StepName.Secrets && secretsStepPageDescription && (
                <Message>
                    <span
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{
                            __html: secretsStepPageDescription
                        }}
                    />
                </Message>
            )}
            {stepName === StepName.Secrets && secretsStepSchema && (
                <SecretsStep
                    selectedEnvironment={secretsStepSchema}
                    typedSecrets={secretsStepData}
                    onChange={onSecretsStepChange}
                    errors={errors}
                />
            )}
            {(stepName === StepName.Summary || statusStepActive) && (
                <SummaryStep
                    installationMode={statusStepActive}
                    selectedEnvironments={summaryStepSchemas}
                    typedSecrets={secretsStepsData}
                    onInstallationStarted={onInstallationStarted}
                    onInstallationFinished={onInstallationFinished}
                    onInstallationCanceled={onInstallationCanceled}
                />
            )}
        </Modal.Content>
    );
};

export default ModalContent;
