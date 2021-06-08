// @ts-nocheck File not migrated fully to TS
/**
 * Created by pposel on 07/02/2017.
 */

const initialInputValues = {
    blueprintName: '',
    blueprintYamlFile: ''
};

const { BlueprintActions, UploadBlueprintBasicForm } = Stage.Common;

export default function UploadModal({
    imageUrl,
    toolbox,
    zipUrl,
    open,
    repositoryName,
    defaultYamlFile,
    onHide,
    yamlFiles
}) {
    const { useEffect, useState } = React;

    const [loading, setLoading] = useState(false);
    const [inputValues, setInputValues] = useState(initialInputValues);
    const [uploadState, setUploadState] = useState();
    const [visibility, setVisibility] = useState(Stage.Common.Consts.defaultVisibility);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (open) {
            setLoading(false);
            setVisibility(Stage.Common.Consts.defaultVisibility);
            setErrors({});
            if (!_.isEmpty(yamlFiles)) {
                setInputValues({ blueprintName: repositoryName, blueprintYamlFile: defaultYamlFile });
            } else {
                setInputValues(initialInputValues);
            }
        }
    }, [open]);

    function submitUpload() {
        const errorsFound = {};

        if (_.isEmpty(inputValues.blueprintName)) {
            errorsFound.blueprintName = 'Please provide blueprint name';
        }

        if (_.isEmpty(inputValues.blueprintYamlFile)) {
            errorsFound.blueprintYamlFile = 'Please provide blueprint YAML file';
        }

        if (!_.isEmpty(errorsFound)) {
            setErrors(errorsFound);
            return;
        }

        // Disable the form
        setLoading(true);
        setUploadState(BlueprintActions.InProgressBlueprintStates.Pending);

        new BlueprintActions(toolbox)
            .doUpload(
                inputValues.blueprintName,
                inputValues.blueprintYamlFile,
                zipUrl,
                null,
                Stage.Utils.Url.url(imageUrl),
                null,
                visibility
            )
            .then(() => {
                setErrors({});
                toolbox.getEventBus().trigger('blueprints:refresh');
                onHide();
            })
            .catch(err => {
                setErrors({ error: err.message });
                setUploadState(err.state);
            })
            .finally(() => setLoading(false));
    }

    function onApprove() {
        submitUpload();
        return false;
    }

    function onCancel() {
        onHide();
        return true;
    }

    function handleInputChange(proxy, field) {
        setInputValues({ ...inputValues, ...Stage.Basic.Form.fieldNameValue(field) });
    }

    const { Modal, CancelButton, ApproveButton, Icon, VisibilityField } = Stage.Basic;

    return (
        <div>
            <Modal open={open} onClose={() => onHide()} className="uploadModal">
                <Modal.Header>
                    <Icon name="upload" /> Upload blueprint from {repositoryName}
                    <VisibilityField
                        visibility={visibility}
                        className="rightFloated"
                        onVisibilityChange={setVisibility}
                    />
                </Modal.Header>

                <Modal.Content>
                    <UploadBlueprintBasicForm
                        yamlFileHelp="As you can have more than one yaml file in the archive,
                                              you need to specify which is the main one for your application."
                        onErrorsDismiss={() => setErrors({})}
                        onInputChange={handleInputChange}
                        blueprintName={inputValues.blueprintName}
                        blueprintYamlFile={inputValues.blueprintYamlFile}
                        errors={errors}
                        blueprintUploading={loading}
                        uploadState={uploadState}
                        yamlFiles={yamlFiles}
                    />
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={onCancel} disabled={loading} />
                    <ApproveButton
                        onClick={onApprove}
                        disabled={loading}
                        content="Upload"
                        icon="upload"
                        color="green"
                    />
                </Modal.Actions>
            </Modal>
        </div>
    );
}

/**
 * propTypes
 *
 * @property {object} yamlFiles array containing list of YAML files and repository name
 * @property {string} repositoryName string name of the repository used as a blueprint name
 * @property {boolean} open modal open state
 * @property {Function} onHide function called when modal is closed
 * @property {object} toolbox Toolbox object
 * @property {string} defaultYamlFile string name of the repository used as a blueprint name
 */
UploadModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    repositoryName: PropTypes.string.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    yamlFiles: PropTypes.arrayOf(PropTypes.string).isRequired,
    zipUrl: PropTypes.string.isRequired,

    defaultYamlFile: PropTypes.string,
    imageUrl: PropTypes.string
};

UploadModal.defaultProps = {
    defaultYamlFile: '',
    imageUrl: undefined
};
