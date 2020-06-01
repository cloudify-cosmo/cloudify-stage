/**
 * Created by pposel on 07/02/2017.
 */

export default class UploadModal extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = UploadModal.initialState;
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
    static propTypes = {
        repositoryName: PropTypes.string.isRequired,
        yamlFiles: PropTypes.array.isRequired,
        open: PropTypes.bool.isRequired,
        onHide: PropTypes.func.isRequired,
        toolbox: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
        defaultYamlFile: PropTypes.string
    };

    static defaultProps = {
        defaultYamlFile: ''
    };

    static initialState = {
        loading: false,
        blueprintName: '',
        blueprintYamlFile: '',
        yamlFiles: [],
        visibility: Stage.Common.Consts.defaultVisibility,
        errors: {}
    };

    onApprove() {
        this.submitUpload();
        return false;
    }

    onCancel() {
        const { onHide } = this.props;
        onHide();
        return true;
    }

    componentDidUpdate(prevProps) {
        const { open, repositoryName, defaultYamlFile: blueprintYamlFile, yamlFiles } = this.props;
        if (!prevProps.open && open) {
            if (!_.isEmpty(yamlFiles)) {
                const blueprintName = repositoryName;

                this.setState({
                    ...UploadModal.initialState,
                    blueprintName,
                    blueprintYamlFile,
                    yamlFiles
                });
            } else {
                this.setState(UploadModal.initialState);
            }
        }
    }

    submitUpload() {
        const { blueprintName, blueprintYamlFile, visibility } = this.state;
        const { actions, imageUrl, onHide, toolbox, zipUrl } = this.props;
        const errors = {};

        if (_.isEmpty(blueprintName)) {
            errors.blueprintName = 'Please provide blueprint name';
        }

        if (_.isEmpty(blueprintYamlFile)) {
            errors.blueprintYamlFile = 'Please provide blueprint YAML file';
        }

        if (!_.isEmpty(errors)) {
            this.setState({ errors });
            return false;
        }

        // Disable the form
        this.setState({ loading: true });

        actions
            .doUpload(blueprintName, blueprintYamlFile, zipUrl, imageUrl, visibility)
            .then(() => {
                this.setState({ errors: {}, loading: false });
                toolbox.getEventBus().trigger('blueprints:refresh');
                onHide();
            })
            .catch(err => {
                this.setState({ errors: { error: err.message }, loading: false });
            });
    }

    handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        const { blueprintName, blueprintYamlFile, errors, loading, visibility, yamlFiles: yamlFilesState } = this.state;
        const { onHide, open, repositoryName } = this.props;
        const { Modal, CancelButton, ApproveButton, Icon, Form, VisibilityField } = Stage.Basic;

        const yamlFiles = _.map(yamlFilesState, item => {
            return { text: item, value: item };
        });

        return (
            <div>
                <Modal open={open} onClose={() => onHide()} className="uploadModal">
                    <Modal.Header>
                        <Icon name="upload" /> Upload blueprint from {repositoryName}
                        <VisibilityField
                            visibility={visibility}
                            className="rightFloated"
                            onVisibilityChange={visibility => this.setState({ visibility })}
                        />
                    </Modal.Header>

                    <Modal.Content>
                        <Form loading={loading} errors={errors} onErrorsDismiss={() => this.setState({ errors: {} })}>
                            <Form.Field
                                label="Blueprint name"
                                required
                                error={errors.blueprintName}
                                help="The package will be uploaded to the Manager as a Blueprint resource,
                                              under the name you specify here."
                            >
                                <Form.Input
                                    name="blueprintName"
                                    value={blueprintName}
                                    onChange={this.handleInputChange.bind(this)}
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
                                    options={yamlFiles}
                                    value={blueprintYamlFile}
                                    onChange={this.handleInputChange.bind(this)}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>

                    <Modal.Actions>
                        <CancelButton onClick={this.onCancel.bind(this)} disabled={loading} />
                        <ApproveButton
                            onClick={this.onApprove.bind(this)}
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
}
