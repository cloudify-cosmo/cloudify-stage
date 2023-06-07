import type { FunctionComponent } from 'react';
import React from 'react';
import { useBoolean, useErrors, useInputs, useOpenProp, useResettableState } from '../../../utils/hooks';
import Consts from '../Consts';
import type { Visibility } from '../types';
import BlueprintActions, { InProgressBlueprintStates } from './BlueprintActions';
import UploadBlueprintForm from './UploadBlueprintForm';
import StageUtils from '../../../utils/stageUtils';
import { ApproveButton, CancelButton, Icon, Modal, VisibilityField } from '../../../components/basic';

const translate = StageUtils.getT('widgets.common.blueprintUpload');

export interface UploadBlueprintModalProps {
    toolbox: Stage.Types.Toolbox;
    open: boolean;
    onHide: () => void;
}

type ValidationErrors = {
    [key: string]: string;
};

type FieldValue = string | null;

type InnerFormError = Record<string, any>;

type FieldValues = {
    [key: string]: FieldValue | InnerFormError;
};

const UploadBlueprintModal: FunctionComponent<UploadBlueprintModalProps> = ({ toolbox, open, onHide }) => {
    const { useState, useRef } = React;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const { errors, setErrors, clearErrors, setMessageAsError } = useErrors();
    const [visibility, setVisibility, clearVisibility] = useResettableState<Visibility>(Consts.defaultVisibility);
    const [inputs, setInputs, clearInputs] = useInputs({
        blueprintUrl: '',
        blueprintFile: null,
        blueprintName: '',
        blueprintYamlFile: '',
        imageUrl: '',
        imageFile: undefined
    });
    const [uploadState, setUploadState] = useState<string>();

    const actions = useRef(new BlueprintActions(toolbox));

    useOpenProp(open, () => {
        unsetLoading();
        clearErrors();
        clearVisibility();
        clearInputs();
    });

    function uploadBlueprint() {
        const {
            blueprintFile,
            blueprintYamlFile,
            blueprintName,
            imageFile,
            blueprintUrl: blueprintUrlState,
            imageUrl: imageUrlState
        } = inputs;
        const blueprintUrl = blueprintFile ? '' : blueprintUrlState;
        const imageUrl = imageFile ? '' : imageUrlState;

        const validationErrors: ValidationErrors = {};

        if (!blueprintFile) {
            if (_.isEmpty(blueprintUrl)) {
                validationErrors.blueprintUrl = translate('validationErrors.noBlueprintPackage');
            } else if (!StageUtils.Url.isUrl(blueprintUrl)) {
                validationErrors.blueprintUrl = translate('validationErrors.invalidBlueprintUrl');
            }
        }

        if (_.isEmpty(blueprintName)) {
            validationErrors.blueprintName = translate('validationErrors.noBlueprintName');
        }

        if (_.isEmpty(blueprintYamlFile)) {
            validationErrors.blueprintYamlFile = translate('validationErrors.noBlueprintYamlFile');
        }

        if (!_.isEmpty(imageUrl) && !StageUtils.Url.isUrl(imageUrl)) {
            validationErrors.imageUrl = translate('validationErrors.invalidImageUrl');
        }

        if (!_.isEmpty(validationErrors)) {
            setErrors(validationErrors);
            return;
        }

        // Disable the form
        setUploadState(InProgressBlueprintStates.Pending);
        setLoading();

        actions.current
            .doUpload(blueprintName, {
                blueprintYamlFile,
                blueprintUrl,
                file: blueprintFile!,
                imageUrl,
                image: imageFile,
                visibility,
                onStateChanged: setUploadState
            })
            .then(() => {
                const widget = toolbox.getWidget();
                clearErrors();
                toolbox.drillDown(
                    widget,
                    'blueprint',
                    { blueprintId: blueprintName, openDeploymentModal: true },
                    blueprintName
                );
            })
            .catch(e => {
                setMessageAsError(e);
                setUploadState(e.state);
            })
            .finally(unsetLoading);
    }

    function onFormFieldChange(values: FieldValues) {
        setInputs(values);
    }

    const { blueprintFile, blueprintYamlFile, blueprintName, blueprintUrl, imageFile, imageUrl } = inputs;

    return (
        <div>
            <Modal open={open} onClose={onHide} className="uploadBlueprintModal">
                <Modal.Header>
                    <Icon name="upload" /> {translate('modal.header')}
                    <VisibilityField
                        visibility={visibility}
                        className="rightFloated"
                        onVisibilityChange={setVisibility}
                    />
                </Modal.Header>

                <Modal.Content>
                    <UploadBlueprintForm
                        blueprintUrl={blueprintUrl}
                        blueprintFile={blueprintFile}
                        blueprintName={blueprintName}
                        blueprintYamlFile={blueprintYamlFile}
                        imageUrl={imageUrl}
                        imageFile={imageFile}
                        errors={errors}
                        loading={isLoading}
                        uploadState={uploadState}
                        onChange={onFormFieldChange}
                        toolbox={toolbox}
                        clearErrors={clearErrors}
                    />
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={onHide} disabled={isLoading} />
                    <ApproveButton
                        onClick={uploadBlueprint}
                        disabled={isLoading}
                        content={translate('modal.uploadButton')}
                        icon="upload"
                    />
                </Modal.Actions>
            </Modal>
        </div>
    );
};

export default React.memo(UploadBlueprintModal, _.isEqual);
