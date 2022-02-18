import { FunctionComponent } from 'react';

const { BlueprintActions } = Stage.Common;
const t = Stage.Utils.getT('widgets.common.blueprintUpload');

interface UploadBlueprintModalProps {
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
    const {
        Hooks: { useBoolean, useInputs, useOpenProp, useErrors, useResettableState }
    } = Stage;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const { errors, setErrors, clearErrors, setMessageAsError } = useErrors();
    const [visibility, setVisibility, clearVisibility] = useResettableState(Stage.Common.Consts.defaultVisibility);
    const [inputs, setInputs, clearInputs] = useInputs({
        blueprintUrl: '',
        blueprintFile: null,
        blueprintName: '',
        blueprintYamlFile: '',
        imageUrl: '',
        imageFile: null
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
                validationErrors.blueprintUrl = t('validationErrors.noBlueprintPackage');
            } else if (!Stage.Utils.Url.isUrl(blueprintUrl)) {
                validationErrors.blueprintUrl = t('validationErrors.invalidBlueprintUrl');
            }
        }

        if (_.isEmpty(blueprintName)) {
            validationErrors.blueprintName = t('validationErrors.noBlueprintName');
        }

        if (_.isEmpty(blueprintYamlFile)) {
            validationErrors.blueprintYamlFile = t('validationErrors.noBlueprintYamlFile');
        }

        if (!_.isEmpty(imageUrl) && !Stage.Utils.Url.isUrl(imageUrl)) {
            validationErrors.imageUrl = t('validationErrors.invalidImageUrl');
        }

        if (!_.isEmpty(validationErrors)) {
            setErrors(validationErrors);
            return;
        }

        // Disable the form
        setUploadState(BlueprintActions.InProgressBlueprintStates.Pending);
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
                clearErrors();
                onHide();
                toolbox.refresh();
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
    const { ApproveButton, CancelButton, Icon, Modal, VisibilityField } = Stage.Basic;
    // @ts-expect-error UploadBlueprintForm is not converted to TS yet
    const { UploadBlueprintForm } = Stage.Common;

    return (
        <div>
            <Modal open={open} onClose={onHide} className="uploadBlueprintModal">
                <Modal.Header>
                    <Icon name="upload" /> {t('modal.header')}
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
                        content={t('modal.uploadButton')}
                        icon="upload"
                        color="green"
                    />
                </Modal.Actions>
            </Modal>
        </div>
    );
};

export default UploadBlueprintModal;

declare global {
    namespace Stage.Common {
        export { UploadBlueprintModal };
    }
}

Stage.defineCommon({
    name: 'UploadBlueprintModal',
    common: React.memo(UploadBlueprintModal, _.isEqual)
});
