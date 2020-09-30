/**
 * Created by pposel on 07/02/2017.
 */

import ActionsPropType from './props/ActionsPropType';

const initialInputValues = {
    blueprintName: '',
    blueprintYamlFile: ''
};

export default function UploadModal({
    actions,
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

    function onApprove() {
        submitUpload();
        return false;
    }

    function onCancel() {
        onHide();
        return true;
    }

    function submitUpload() {
        const errors = {};

        if (_.isEmpty(inputValues.blueprintName)) {
            errors.blueprintName = 'Please provide blueprint name';
        }

        if (_.isEmpty(inputValues.blueprintYamlFile)) {
            errors.blueprintYamlFile = 'Please provide blueprint YAML file';
        }

        if (!_.isEmpty(errors)) {
            setErrors(errors);
            return false;
        }

        // Disable the form
        setLoading(true);

        actions
            .doUpload(inputValues.blueprintName, inputValues.blueprintYamlFile, zipUrl, imageUrl, visibility)
            .then(() => {
                setLoading(false);
                setErrors({});
                toolbox.getEventBus().trigger('blueprints:refresh');
                onHide();
            })
            .catch(err => {
                setErrors({ error: err.message });
            })
            .finally(() => setLoading(false));
    }

    function handleInputChange(proxy, field) {
        setInputValues({ ...inputValues, ...Stage.Basic.Form.fieldNameValue(field) });
    }

    const { Modal, CancelButton, ApproveButton, Icon, Form, VisibilityField } = Stage.Basic;

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
                    <Form loading={loading} errors={errors} onErrorsDismiss={() => setErrors({})}>
                        <Form.Field
                            label="Blueprint name"
                            required
                            error={errors.blueprintName}
                            help="The package will be uploaded to the Manager as a Blueprint resource,
                                              under the name you specify here."
                        >
                            <Form.Input
                                name="blueprintName"
                                value={inputValues.blueprintName}
                                onChange={handleInputChange}
                            />
                        </Form.Field>
                        <Form.Field
                            label="Blueprint YAML file"
                            required
                            error={errors.blueprintYamlFile}
                            help="As you can have more than one yaml file in the archive,
                                              you need to specify which is the main one for your application."
                        >
                            <Form.Dropdown
                                name="blueprintYamlFile"
                                search
                                selection
                                options={_.map(yamlFiles, item => {
                                    return { text: item, value: item };
                                })}
                                value={inputValues.blueprintYamlFile}
                                onChange={handleInputChange}
                            />
                        </Form.Field>
                    </Form>
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
 * @property {object} actions Actions object
 * @property {string} defaultYamlFile string name of the repository used as a blueprint name
 */
UploadModal.propTypes = {
    actions: ActionsPropType.isRequired,
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
