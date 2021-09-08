import React from 'react';

import { Divider, ErrorMessage, Modal } from '../basic';
import gettingStartedSchema from './schema.json';
import EnvironmentsStep from './steps/EnvironmentsStep';
import SecretsStep from './steps/SecretsStep';
import SummaryStep from './steps/SummaryStep';
import WelcomeStep from './steps/WelcomeStep';
import { GettingStartedSchemaItem, StepName } from './model';

import type {
    GettingStartedData,
    GettingStartedSchema,
    GettingStartedSecretsData,
    GettingStartedEnvironmentsData
} from './model';

const castedGettingStartedSchema = gettingStartedSchema as GettingStartedSchema;

type Props = {
    stepErrors?: string[];
    stepName: StepName;
    environmentsStepData?: GettingStartedEnvironmentsData;
    secretsStepsSchemas: GettingStartedSchemaItem[];
    secretsStepsData: GettingStartedData;
    secretsStepIndex: number;
    summaryStepSchemas: GettingStartedSchemaItem[];
    onStepErrorsDismiss: () => void;
    onEnvironmentsStepChange: (environments: GettingStartedEnvironmentsData) => void;
    onSecretsStepChange: (secrets: GettingStartedSecretsData) => void;
    onInstallationStarted: () => void;
    onInstallationFinished: () => void;
    onInstallationCanceled: () => void;
};

const ModalContent = ({
    stepErrors,
    stepName,
    environmentsStepData,
    secretsStepsSchemas,
    secretsStepsData,
    secretsStepIndex,
    summaryStepSchemas,
    onStepErrorsDismiss,
    onEnvironmentsStepChange,
    onSecretsStepChange,
    onInstallationStarted,
    onInstallationFinished,
    onInstallationCanceled
}: Props) => {
    const secretsStepSchema = secretsStepsSchemas[secretsStepIndex];
    const secretsStepData = secretsStepsData[secretsStepSchema?.name];
    const statusStepActive = stepName === StepName.Status;
    return (
        <Modal.Content style={{ minHeight: 220, flexDirection: 'column' }}>
            {!_.isEmpty(stepErrors) && (
                <>
                    <ErrorMessage header={null} error={stepErrors} onDismiss={onStepErrorsDismiss} />
                    <Divider hidden />
                </>
            )}
            {stepName === StepName.Welcome && <WelcomeStep />}
            {stepName === StepName.Environments && (
                <EnvironmentsStep
                    schema={castedGettingStartedSchema}
                    selectedEnvironments={environmentsStepData}
                    onChange={onEnvironmentsStepChange}
                />
            )}
            {stepName === StepName.Secrets && secretsStepSchema && (
                <SecretsStep
                    selectedEnvironment={secretsStepSchema}
                    typedSecrets={secretsStepData}
                    onChange={onSecretsStepChange}
                    markEmptyInputs={!_.isEmpty(stepErrors)}
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
