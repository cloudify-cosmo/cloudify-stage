import React, { memo, useEffect, useMemo, useState } from 'react';
import log from 'loglevel';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';

import StageUtils from '../../utils/stageUtils';
import EventBus from '../../utils/EventBus';
import { useInput, useOpenProp, useBoolean } from '../../utils/hooks';
import useResettableState from '../../utils/hooks/useResettableState';
import gettingStartedJson from './schema/gettingStarted.schema.json';
import cloudSetupJson from './schema/cloudSetup.schema.json';
import useModalOpenState from './useModalOpenState';
import createEnvironmentsGroups from './createEnvironmentsGroups';
import type {
    GettingStartedData,
    GettingStartedEnvironmentsData,
    GettingStartedSchema,
    GettingStartedSecretsData,
    GettingStartedSchemaItem,
    GettingStartedSchemaSecret
} from './model';
import { StepName } from './model';

import type { ReduxState } from '../../reducers';
import useCloudSetupUrlParam from './useCloudSetupUrlParam';
import Consts from '../../utils/consts';
import GettingStartedModal from './GettingStartedModal';

type Error = boolean | { content: string };

export type Errors = {
    [x: string]: Error;
};

const t = StageUtils.getT('gettingStartedModal.secrets');

const isEmailValid = (email: string) => Consts.EMAIL_REGEX.test(email);
const isPortValid = (port: string) => {
    const portNum = Number(port);
    return portNum >= 1 && portNum <= 65535;
};

const gettingStartedSchema = gettingStartedJson as GettingStartedSchema;
const cloudSetupSchema = cloudSetupJson as GettingStartedSchema;

const GettingStartedModalContainer = () => {
    const modalOpenState = useModalOpenState();
    const dispatch = useDispatch();
    const manager = useSelector((state: ReduxState) => state.manager);
    const [stepName, setStepName] = useState(StepName.Welcome);
    const [environmentsStepData, setEnvironmentsStepData, resetEnvironmentsStepData] =
        useResettableState<GettingStartedEnvironmentsData>({});
    const [secretsStepIndex, setSecretsStepIndex, resetSecretsStepIndex] = useResettableState(0);
    const [secretsStepsData, setSecretsStepsData, resetSecretsStepsData] = useResettableState<GettingStartedData>({});

    const [installationProcessing, setInstallationProcessing, resetInstallationProcessing] = useResettableState(false);
    const [modalDisabledChecked, setModalDisabledChange] = useInput(false);
    const [cancelConfirmOpen, openCancelConfirm, closeCancelConfirm] = useBoolean();
    const [schema, setSchema] = useState(gettingStartedSchema);
    const [cloudSetupUrlParam] = useCloudSetupUrlParam();

    const commonStepsSchemas = useMemo(
        () => schema.content.filter(item => environmentsStepData[item.name]),
        [environmentsStepData]
    );

    const secretsStepsSchemas = useMemo(() => createEnvironmentsGroups(commonStepsSchemas), [environmentsStepData]);
    const summaryStepSchemas = useMemo(() => {
        return commonStepsSchemas.reduce(
            (result, item) => {
                if (item.secrets.length === 0) {
                    result.push(item);
                }
                return result;
            },
            [...secretsStepsSchemas]
        );
    }, [commonStepsSchemas, secretsStepsSchemas]);

    useOpenProp(modalOpenState.modalOpen, () => {
        setStepName(StepName.Welcome);
        resetEnvironmentsStepData();
        resetSecretsStepIndex();
        resetSecretsStepsData();
        resetInstallationProcessing();
    });

    useEffect(() => {
        setModalDisabledChange(!modalOpenState.shouldAutomaticallyShowModal);
    }, [modalOpenState.shouldAutomaticallyShowModal]);

    useEffect(() => {
        setSchema(cloudSetupUrlParam ? cloudSetupSchema : gettingStartedSchema);
    }, [cloudSetupUrlParam]);

    if (!StageUtils.isUserAuthorized('getting_started', manager)) {
        return null;
    }

    function goToNextStep() {
        setStepName(stepName + 1);
    }

    const secretsStepSchema = secretsStepsSchemas[secretsStepIndex] as GettingStartedSchemaItem | undefined;
    const defaultErrors: Errors = secretsStepSchema
        ? secretsStepSchema.secrets.reduce(
              (finalObject, secret) => ({
                  ...finalObject,
                  [secret.name]: false
              }),
              {}
          )
        : {};
    const [errors, setErrors, clearErrors] = useResettableState(defaultErrors);

    const redirectUponModalClosing = (completedProcess?: boolean) => {
        const redirectPath = completedProcess ? Consts.PAGE_PATH.BLUEPRINTS : Consts.PAGE_PATH.DASHBOARD;
        dispatch(push(redirectPath));
    };

    const handleEnvironmentClick = (selectedEnvironments: GettingStartedEnvironmentsData) => {
        setEnvironmentsStepData(selectedEnvironments);
        goToNextStep();
        setSecretsStepIndex(0);
    };
    const handleSecretsStepChange = (typedSecrets: GettingStartedSecretsData) => {
        if (secretsStepSchema) {
            setSecretsStepsData({ ...secretsStepsData, [secretsStepSchema.name]: typedSecrets });
        }
    };
    const handleInstallationStarted = () => {
        setInstallationProcessing(true);
    };
    const handleInstallationFinishedOrCanceled = () => {
        EventBus.trigger('plugins:refresh');
        EventBus.trigger('secrets:refresh');
        setInstallationProcessing(false);
    };

    const closeModal = (completedProcess?: boolean) => {
        modalOpenState.closeModal(modalDisabledChecked);
        redirectUponModalClosing(completedProcess);
        closeCancelConfirm();
    };

    const handleModalClose = () => {
        if (stepName !== StepName.Status) openCancelConfirm();
        else closeModal(true);
    };

    const cancelModal = () => {
        closeModal();
    };

    const handleBackClick = () => {
        function goToPreviousStep() {
            setStepName(stepName - 1);
        }

        switch (stepName) {
            case StepName.Environments:
            case StepName.Status:
                goToPreviousStep();
                setStepName(StepName.Welcome);
                break;

            case StepName.Summary:
                if (secretsStepsSchemas.length > 0) {
                    goToPreviousStep();
                    setSecretsStepIndex(secretsStepsSchemas.length - 1);
                } else {
                    setStepName(StepName.Environments);
                }
                break;

            case StepName.Secrets:
                if (secretsStepIndex > 0) {
                    setSecretsStepIndex(secretsStepIndex - 1);
                } else {
                    goToPreviousStep();
                }
                break;

            default:
                log.error('Incorrect step name');
                break;
        }
    };

    const handleNextClick = () => {
        const validateInputs = (secrets: GettingStartedSchemaSecret[], key: string) => {
            clearErrors();
            return secrets
                .map(({ name, type }) => {
                    const allData = secretsStepsData[key];
                    const data = allData?.[name];
                    const setErrorsContent = (tKey: string) => {
                        setErrors({
                            ...errors,
                            [name]: {
                                content: t(tKey)
                            }
                        });
                    };

                    if (type === 'email' && data && !isEmailValid(data)) {
                        setErrorsContent('invalidEmail');
                        return false;
                    }

                    if (type === 'port' && data && !isPortValid(data)) {
                        setErrorsContent('invalidPort');
                        return false;
                    }
                    return true;
                })
                .every((isValid: Error) => isValid);
        };

        let secretsValid = true;
        if (secretsStepSchema) {
            const { secrets, name } = secretsStepSchema;
            secretsValid = validateInputs(secrets, name);
        }
        switch (stepName) {
            case StepName.Environments:
                if (secretsStepsSchemas.length > 0) {
                    goToNextStep();
                    setSecretsStepIndex(0);
                } else {
                    setStepName(StepName.Summary);
                }
                break;

            case StepName.Secrets:
                if (secretsValid) {
                    if (secretsStepIndex < secretsStepsSchemas.length - 1) {
                        setSecretsStepIndex(secretsStepIndex + 1);
                    } else {
                        goToNextStep();
                    }
                }
                break;

            case StepName.Welcome:
            case StepName.Summary:
                goToNextStep();
                break;

            default:
                log.error('Incorrect step name');
                break;
        }
    };

    return (
        <GettingStartedModal
            {...{
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
            }}
        />
    );
};

export default memo(GettingStartedModalContainer);
