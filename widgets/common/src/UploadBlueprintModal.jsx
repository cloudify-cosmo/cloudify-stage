/**
 * Created by kinneretzin on 05/10/2016.
 */

const { BlueprintActions } = Stage.Common;

function UploadBlueprintModal({ toolbox, open, onHide }) {
    const { useState, useRef } = React;
    const { useBoolean, useInputs, useOpenProp, useErrors, useResettableState } = Stage.Hooks;

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
    const [uploadState, setUploadState] = useState();

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

        const validationErrors = {};

        if (!blueprintFile) {
            if (_.isEmpty(blueprintUrl)) {
                validationErrors.blueprintUrl = 'Please select blueprint package';
            } else if (!Stage.Utils.Url.isUrl(blueprintUrl)) {
                validationErrors.blueprintUrl = 'Please provide valid URL for blueprint package';
            }
        }

        if (_.isEmpty(blueprintName)) {
            validationErrors.blueprintName = 'Please provide blueprint name';
        }

        if (_.isEmpty(blueprintYamlFile)) {
            validationErrors.blueprintYamlFile = 'Please provide blueprint YAML file';
        }

        if (!_.isEmpty(imageUrl) && !Stage.Utils.Url.isUrl(blueprintUrl)) {
            validationErrors.imageUrl = 'Please provide valid URL for blueprint icon';
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
                    <Icon name="upload" /> Upload blueprint
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
                        blueprintFileName={blueprintYamlFile}
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
                        content="Upload"
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
