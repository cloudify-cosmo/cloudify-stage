import { useEffect } from 'react';

// @ts-nocheck File not migrated fully to TS
const { BlueprintActions } = Stage.Common;
const i18nPrefix = 'widgets.common.blueprintUpload';

// NOTE: prevents leaking variables as global in TypeScript
export {};

function UploadBlueprintModal({ toolbox, open, onHide }) {
    const { useState, useRef } = React;
    const {
        i18n,
        Hooks: { useBoolean, useInputs, useOpenProp, useErrors, useResettableState }
    } = Stage;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    // NOTE: Here we can see the problem 😁
    // Errors are being set with the useInputs hook, which is not being responsible for handling errors
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
    const [uploadState, setUploadState] = useState();

    const actions = useRef(new BlueprintActions(toolbox));

    useEffect(() => {
        // eslint-disable-next-line
        console.log(inputs);
    }, [inputs]);

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

        const validationErrors = {};

        if (!blueprintFile) {
            if (_.isEmpty(blueprintUrl)) {
                validationErrors.blueprintUrl = i18n.t(`${i18nPrefix}.validationErrors.noBlueprintPackage`);
            } else if (!Stage.Utils.Url.isUrl(blueprintUrl)) {
                validationErrors.blueprintUrl = i18n.t(`${i18nPrefix}.validationErrors.invalidBlueprintUrl`);
            }
        }

        if (_.isEmpty(blueprintName)) {
            validationErrors.blueprintName = i18n.t(`${i18nPrefix}.validationErrors.noBlueprintName`);
        }

        if (_.isEmpty(blueprintYamlFile)) {
            validationErrors.blueprintYamlFile = i18n.t(`${i18nPrefix}.validationErrors.noBlueprintYamlFile`);
        }

        if (!_.isEmpty(imageUrl) && !Stage.Utils.Url.isUrl(imageUrl)) {
            validationErrors.imageUrl = i18n.t(`${i18nPrefix}.validationErrors.invalidImageUrl`);
        }

        if (!_.isEmpty(validationErrors)) {
            setErrors(validationErrors);
            return;
        }

        // Disable the form
        setUploadState(BlueprintActions.InProgressBlueprintStates.Pending);
        setLoading();

        actions.current
            .doUpload(
                blueprintName,
                blueprintYamlFile,
                blueprintUrl,
                blueprintFile,
                imageUrl,
                imageFile,
                visibility,
                setUploadState
            )
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

    function onFormFieldChange(values) {
        setInputs(values);
    }

    const { blueprintFile, blueprintYamlFile, blueprintName, blueprintUrl, imageFile, imageUrl } = inputs;
    const { ApproveButton, CancelButton, Icon, Modal, VisibilityField } = Stage.Basic;
    const { UploadBlueprintForm } = Stage.Common;

    return (
        <div>
            <Modal open={open} onClose={onHide} className="uploadBlueprintModal">
                <Modal.Header>
                    <Icon name="upload" /> {i18n.t(`${i18nPrefix}.modal.header`)}
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
                    />
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={onHide} disabled={isLoading} />
                    <ApproveButton
                        onClick={uploadBlueprint}
                        disabled={isLoading}
                        content={i18n.t(`${i18nPrefix}.modal.uploadButton`)}
                        icon="upload"
                        color="green"
                    />
                </Modal.Actions>
            </Modal>
        </div>
    );
}

UploadBlueprintModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};

Stage.defineCommon({
    name: 'UploadBlueprintModal',
    common: React.memo(UploadBlueprintModal, _.isEqual)
});
