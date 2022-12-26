import React, { memo } from 'react';
import i18n from 'i18next';
import { Confirm, Form, Modal } from '../basic';
import type {
    GettingStartedEnvironmentsData,
    GettingStartedSchema,
    GettingStartedSchemaItem,
    GettingStartedData,
    GettingStartedSecretsData
} from './model';

import { StepName } from './model';
import ModalHeader from './ModalHeader';
import ModalContent from './ModalContent';
import ModalActions from './ModalActions';
import { Errors } from './GettingStartedModalContainer';
import { StrictCheckboxProps } from 'semantic-ui-react';

type GettingStartedModalProps = {
    modalOpenState: {
        modalOpen: boolean;
        closeModal: (shouldDisableModal: boolean) => Promise<void>;
        shouldAutomaticallyShowModal: boolean;
    };
    handleModalClose: () => void;
    stepName: StepName;
    secretsStepIndex: number;
    secretsStepsSchemas: GettingStartedSchemaItem[];
    secretsStepsData: GettingStartedData;
    summaryStepSchemas: GettingStartedSchemaItem[];
    schema: GettingStartedSchema;
    handleEnvironmentClick: (selectedEnvironments: GettingStartedEnvironmentsData) => void;
    handleSecretsStepChange: (typedSecrets: GettingStartedSecretsData) => void;
    handleInstallationStarted: () => void;
    handleInstallationFinishedOrCanceled: () => void;
    errors: Errors;
    cloudSetupUrlParam: boolean;
    modalDisabledChecked: boolean;
    setModalDisabledChange: StrictCheckboxProps['onChange'];
    installationProcessing: boolean;
    handleBackClick: () => void;
    handleNextClick: () => void;
    environmentsStepData: GettingStartedEnvironmentsData;
    cancelConfirmOpen: boolean;
    cancelModal: () => void;
    closeCancelConfirm: () => void;
};

const GettingStartedModal = ({
    modalOpenState,
    handleModalClose,
    stepName,
    secretsStepIndex,
    secretsStepsSchemas,
    secretsStepsData,
    summaryStepSchemas,
    schema,
    handleEnvironmentClick,
    handleSecretsStepChange,
    handleInstallationStarted,
    handleInstallationFinishedOrCanceled,
    errors,
    cloudSetupUrlParam,
    modalDisabledChecked,
    setModalDisabledChange,
    installationProcessing,
    handleBackClick,
    handleNextClick,
    environmentsStepData,
    cancelConfirmOpen,
    cancelModal,
    closeCancelConfirm
}: GettingStartedModalProps) => {
    return (
        <Modal open={modalOpenState.modalOpen} onClose={handleModalClose}>
            <ModalHeader
                stepName={stepName}
                secretsStepIndex={secretsStepIndex}
                secretsStepsSchemas={secretsStepsSchemas}
            />
            <ModalContent
                stepName={stepName}
                secretsStepsSchemas={secretsStepsSchemas}
                secretsStepsData={secretsStepsData}
                secretsStepIndex={secretsStepIndex}
                summaryStepSchemas={summaryStepSchemas}
                schema={schema}
                onEnvironmentsStepChange={handleEnvironmentClick}
                onSecretsStepChange={handleSecretsStepChange}
                onInstallationStarted={handleInstallationStarted}
                onInstallationFinished={handleInstallationFinishedOrCanceled}
                onInstallationCanceled={handleInstallationFinishedOrCanceled}
                errors={errors}
            />
            {stepName !== StepName.Welcome && !cloudSetupUrlParam && (
                <Modal.Content style={{ minHeight: 60, overflow: 'hidden' }}>
                    <Form.Field>
                        <Form.Checkbox
                            label={i18n.t('gettingStartedModal.disableModalLabel')}
                            help=""
                            checked={modalDisabledChecked}
                            onChange={setModalDisabledChange}
                        />
                    </Form.Field>
                </Modal.Content>
            )}
            <ModalActions
                stepName={stepName}
                installationProcessing={installationProcessing}
                onBackClick={handleBackClick}
                onNextClick={handleNextClick}
                onModalClose={handleModalClose}
                environmentsStepData={environmentsStepData}
            />
            <Confirm
                open={cancelConfirmOpen}
                content={i18n.t('gettingStartedModal.cancelConfirm')}
                onConfirm={cancelModal}
                onCancel={closeCancelConfirm}
            />
        </Modal>
    );
};

export default memo(GettingStartedModal);
