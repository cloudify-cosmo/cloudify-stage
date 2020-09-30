/**
 * Created by kinneretzin on 05/10/2016.
 */

function UploadBlueprintModal({ toolbox, open, onHide }) {
    const { useRef } = React;
    const { useBoolean, useInputs, useOpenProp, useErrors, useResettableState } = Stage.Hooks;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const { errors, setErrors, clearErrors, setMessageAsError } = useErrors();
    const [visibility, setVisibility, clearVisibility] = useResettableState(Stage.Common.Consts.defaultVisibility);
    const [inputs, setInputs, clearInputs] = useInputs({
        blueprintUrl: '',
        blueprintFile: null,
        blueprintName: '',
        blueprintFileName: '',
        imageUrl: '',
        imageFile: null
    });

    const actions = useRef(new Stage.Common.BlueprintActions(toolbox));

    useOpenProp(open, () => {
        unsetLoading();
        clearErrors();
        clearVisibility();
        clearInputs();
    });

    function uploadBlueprint() {
        const {
            blueprintFile,
            blueprintFileName,
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

        if (_.isEmpty(blueprintFileName)) {
            validationErrors.blueprintFileName = 'Please provide blueprint YAML file';
        }

        if (!_.isEmpty(imageUrl) && !Stage.Utils.Url.isUrl(blueprintUrl)) {
            validationErrors.imageUrl = 'Please provide valid URL for blueprint icon';
        }

        if (!_.isEmpty(validationErrors)) {
            setErrors(validationErrors);
            return;
        }

        // Disable the form
        setLoading();

        actions.current
            .doUpload(blueprintName, blueprintFileName, blueprintUrl, blueprintFile, imageUrl, imageFile, visibility)
            .then(() => {
                clearErrors();
                onHide();
                toolbox.refresh();
            })
            .catch(setMessageAsError)
            .finally(unsetLoading);
    }

    function onFormFieldChange(values) {
        setInputs(values);
    }

    const { blueprintFile, blueprintFileName, blueprintName, blueprintUrl, imageFile, imageUrl } = inputs;
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
                        blueprintFileName={blueprintFileName}
                        imageUrl={imageUrl}
                        imageFile={imageFile}
                        errors={errors}
                        loading={isLoading}
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
