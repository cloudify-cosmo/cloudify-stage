/**
 * Created by kinneretzin on 05/10/2016.
 */

class UploadBlueprintModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = UploadBlueprintModal.initialState;

        this.actions = new Stage.Common.BlueprintActions(props.toolbox);
    }

    static propTypes = {
        open: PropTypes.bool.isRequired,
        onHide: PropTypes.func.isRequired,
        toolbox: PropTypes.object.isRequired
    };

    static initialState = {
        loading: false,
        visibility: Stage.Common.Consts.defaultVisibility,
        blueprintUrl: '',
        blueprintFile: null,
        blueprintName: '',
        blueprintFileName: '',
        imageUrl: '',
        imageFile: null,
        errors: {}
    };

    componentDidUpdate(prevProps) {
        const { open } = this.props;
        if (prevProps.open && !open) {
            this.setState(UploadBlueprintModal.initialState);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { open } = this.props;
        return !_.isEqual(open, nextProps.open) || !_.isEqual(this.state, nextState);
    }

    uploadBlueprint() {
        const {
            blueprintFile,
            blueprintFileName,
            blueprintName,
            imageFile,
            visibility,
            blueprintUrl: blueprintUrlState,
            imageUrl: imageUrlState
        } = this.state;
        const { onHide, toolbox } = this.props;
        const blueprintUrl = blueprintFile ? '' : blueprintUrlState;
        const imageUrl = imageFile ? '' : imageUrlState;

        const errors = {};

        if (!blueprintFile) {
            if (_.isEmpty(blueprintUrl)) {
                errors.blueprintUrl = 'Please select blueprint package';
            } else if (!Stage.Utils.Url.isUrl(blueprintUrl)) {
                errors.blueprintUrl = 'Please provide valid URL for blueprint package';
            }
        }

        if (_.isEmpty(blueprintName)) {
            errors.blueprintName = 'Please provide blueprint name';
        }

        if (_.isEmpty(blueprintFileName)) {
            errors.blueprintFileName = 'Please provide blueprint YAML file';
        }

        if (!_.isEmpty(imageUrl) && !Stage.Utils.Url.isUrl(blueprintUrl)) {
            errors.imageUrl = 'Please provide valid URL for blueprint icon';
        }

        if (!_.isEmpty(errors)) {
            this.setState({ errors });
            return false;
        }

        // Disable the form
        this.setState({ loading: true });

        this.actions
            .doUpload(blueprintName, blueprintFileName, blueprintUrl, blueprintFile, imageUrl, imageFile, visibility)
            .then(() => {
                this.setState({ errors: {}, loading: false }, onHide);
                toolbox.refresh();
            })
            .catch(err => {
                this.setState({ errors: { error: err.message }, loading: false });
            });
    }

    onFormFieldChange(fields) {
        this.setState(fields);
    }

    render() {
        const {
            blueprintFile,
            blueprintFileName,
            blueprintName,
            blueprintUrl,
            errors,
            imageFile,
            imageUrl,
            loading,
            visibility
        } = this.state;
        const { onHide, open, toolbox } = this.props;
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
                            onVisibilityChange={visibility => this.setState({ visibility })}
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
                            loading={loading}
                            onChange={this.onFormFieldChange.bind(this)}
                            toolbox={toolbox}
                        />
                    </Modal.Content>

                    <Modal.Actions>
                        <CancelButton onClick={onHide} disabled={loading} />
                        <ApproveButton
                            onClick={this.uploadBlueprint.bind(this)}
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

Stage.defineCommon({
    name: 'UploadBlueprintModal',
    common: UploadBlueprintModal
});
