import React from 'react';

import { Divider, ErrorMessage, Modal } from '../basic';
import gettingStartedSchema from './schema.json';
import TechnologiesStep from './steps/TechnologiesStep';
import SecretsStep from './steps/SecretsStep';
import SummaryStep from './steps/SummaryStep';
import { GettingStartedSchemaItem, StepName } from './model';

import type {
    GettingStartedData,
    GettingStartedSchema,
    GettingStartedSecretsData,
    GettingStartedTechnologiesData
} from './model';

const castedGettingStartedSchema = gettingStartedSchema as GettingStartedSchema;

type Props = {
    stepErrors?: string[];
    stepName: StepName;
    technologiesStepData?: GettingStartedTechnologiesData;
    secretsStepsSchemas: GettingStartedSchemaItem[];
    secretsStepsData: GettingStartedData;
    secretsStepIndex: number;
    summaryStepSchemas: GettingStartedSchemaItem[];
    onStepErrorsDismiss: () => void;
    onTechnologiesStepChange: (technologies: GettingStartedTechnologiesData) => void;
    onSecretsStepChange: (secrets: GettingStartedSecretsData) => void;
    onInstallationStarted: () => void;
    onInstallationFinished: () => void;
    onInstallationCanceled: () => void;
};

const ModalContent = ({
    stepErrors,
    stepName,
    technologiesStepData,
    secretsStepsSchemas,
    secretsStepsData,
    secretsStepIndex,
    summaryStepSchemas,
    onStepErrorsDismiss,
    onTechnologiesStepChange,
    onSecretsStepChange,
    onInstallationStarted,
    onInstallationFinished,
    onInstallationCanceled
}: Props) => {
    const secretsStepSchema = secretsStepsSchemas[secretsStepIndex];
    const secretsStepData = secretsStepsData[secretsStepSchema?.name];
    const statusStepActive = stepName === StepName.Status;
    return (
        <Modal.Content style={{ minHeight: 220, display: 'flex', flexDirection: 'column' }}>
            {!_.isEmpty(stepErrors) && (
                <>
                    <ErrorMessage error={stepErrors} onDismiss={onStepErrorsDismiss} />
                    <Divider hidden />
                </>
            )}
            {stepName === StepName.Technologies && (
                <TechnologiesStep
                    schema={castedGettingStartedSchema}
                    selectedTechnologies={technologiesStepData}
                    onChange={onTechnologiesStepChange}
                />
            )}
            {stepName === StepName.Secrets && secretsStepSchema && (
                <SecretsStep
                    selectedTechnology={secretsStepSchema}
                    typedSecrets={secretsStepData}
                    onChange={onSecretsStepChange}
                />
            )}
            {(stepName === StepName.Summary || statusStepActive) && (
                <SummaryStep
                    installationMode={statusStepActive}
                    selectedTechnologies={summaryStepSchemas}
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
