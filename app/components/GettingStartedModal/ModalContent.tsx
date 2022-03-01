import React from 'react';

import { Modal } from '../basic';
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

type Props = {
    stepName: StepName;
    environmentsStepData?: GettingStartedEnvironmentsData;
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
};

const ModalContent = ({
    stepName,
    environmentsStepData,
    secretsStepsSchemas,
    secretsStepsData,
    secretsStepIndex,
    summaryStepSchemas,
    schema,
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
            {stepName === StepName.Welcome && <WelcomeStep />}
            {stepName === StepName.Environments && (
                <EnvironmentsStep
                    schema={schema}
                    selectedEnvironment={environmentsStepData}
                    onChange={onEnvironmentsStepChange}
                />
            )}
            {stepName === StepName.Secrets && secretsStepSchema && (
                <SecretsStep
                    selectedEnvironment={secretsStepSchema}
                    typedSecrets={secretsStepData}
                    onChange={onSecretsStepChange}
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
