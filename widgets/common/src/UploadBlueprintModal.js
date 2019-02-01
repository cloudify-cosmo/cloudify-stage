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
        if (prevProps.open && !this.props.open) {
            this.setState(UploadBlueprintModal.initialState);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.open, nextProps.open) || !_.isEqual(this.state, nextState);
    }

    uploadBlueprint() {
        let blueprintUrl = this.state.blueprintFile ? '' : this.state.blueprintUrl;
        let imageUrl = this.state.imageFile ? '' : this.state.imageUrl;

        let errors = {};

        if (!this.state.blueprintFile) {
            if (_.isEmpty(blueprintUrl)) {
                errors['blueprintUrl'] = 'Please select blueprint package';
            } else if (!Stage.Utils.isUrl(blueprintUrl)) {
                errors['blueprintUrl'] = 'Please provide valid URL for blueprint package';
            }
        }

        if (_.isEmpty(this.state.blueprintName)) {
            errors['blueprintName']='Please provide blueprint name';
        }

        if (_.isEmpty(this.state.blueprintFileName)) {
            errors['blueprintFileName']='Please provide blueprint YAML file';
        }

        if (!_.isEmpty(imageUrl) && !Stage.Utils.isUrl(blueprintUrl)) {
            errors['imageUrl'] = 'Please provide valid URL for blueprint icon';
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        this.actions.doUpload(this.state.blueprintName, this.state.blueprintFileName,
                              blueprintUrl, this.state.blueprintFile,
                              imageUrl, this.state.imageFile,
                              this.state.visibility).then(() => {
            this.setState({errors: {}, loading: false}, this.props.onHide);
            this.props.toolbox.refresh();
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    onFormFieldChange(fields) {
        this.setState(fields);
    }

    render() {
        let {ApproveButton, CancelButton, Icon, Modal, VisibilityField} = Stage.Basic;
        let {UploadBlueprintForm} = Stage.Common;

        return (
            <div>
                <Modal open={this.props.open} onClose={this.props.onHide} className="uploadBlueprintModal">
                    <Modal.Header>
                        <Icon name="upload"/> Upload blueprint
                        <VisibilityField visibility={this.state.visibility} className="rightFloated"
                                         onVisibilityChange={(visibility)=>this.setState({visibility: visibility})}/>
                    </Modal.Header>

                    <Modal.Content>
                        <UploadBlueprintForm blueprintUrl={this.state.blueprintUrl}
                                             blueprintFile={this.state.blueprintFile}
                                             blueprintName={this.state.blueprintName}
                                             blueprintFileName={this.state.blueprintFileName}
                                             imageUrl={this.state.imageUrl}
                                             imageFile={this.state.imageFile}
                                             errors={this.state.errors}
                                             loading={this.state.loading}
                                             onChange={this.onFormFieldChange.bind(this)}
                                             toolbox={this.props.toolbox} />
                    </Modal.Content>

                    <Modal.Actions>
                        <CancelButton onClick={this.props.onHide} disabled={this.state.loading} />
                        <ApproveButton onClick={this.uploadBlueprint.bind(this)} disabled={this.state.loading} content="Upload" icon="upload" color="green"/>
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
};

Stage.defineCommon({
    name: 'UploadBlueprintModal',
    common: UploadBlueprintModal
});
