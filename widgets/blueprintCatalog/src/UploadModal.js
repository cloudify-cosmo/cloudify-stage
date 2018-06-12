import PropTypes from 'prop-types';

/**
 * Created by pposel on 07/02/2017.
 */

export default class UploadModal extends React.Component {

    constructor(props,context) {
        super(props,context);
        this.state = UploadModal.initialState;
    }

    /**
     * propTypes
     * @property {object} files object containing list of files and repository name
     * @property {boolean} open modal open state
     * @property {function} onHide function called when modal is closed
     * @property {object} toolbox Toolbox object
     * @property {object} actions Actions object
     */
    static propTypes = {
        files: PropTypes.object.isRequired,
        open: PropTypes.bool.isRequired,
        onHide: PropTypes.func.isRequired,
        toolbox: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    };

    static initialState = {
        loading: false,
        blueprintName: '',
        blueprintFileName: '',
        yamlFiles: [],
        repository: '',
        visibility: Stage.Common.Consts.defaultVisibility,
        errors: {}
    }

    onApprove () {
        this._submitUpload();
        return false;
    }

    onCancel () {
        this.props.onHide();
        return true;
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.open && nextProps.open) {
            if (!_.isEmpty(nextProps.files)) {
                const defaultBlueprintFileName = 'blueprint.yaml';
                let files = Object.assign({},{tree:[], repo:''}, nextProps.files);
                let yamlFiles = _.map(_.filter(files.tree,
                                               file => file.type === 'blob' && file.path.endsWith('.yaml')),
                                      file => file.path);
                this.setState({
                    ...UploadModal.initialState,
                    blueprintName: files.repo,
                    blueprintFileName: _.includes(yamlFiles, defaultBlueprintFileName)
                        ? defaultBlueprintFileName
                        : yamlFiles[0],
                    yamlFiles,
                    repository: files.repo
                });
            } else {
                this.setState(UploadModal.initialState);
            }
        }
    }

    _submitUpload() {
        let errors = {};

        if (_.isEmpty(this.state.blueprintName)) {
            errors['blueprintName']='Please provide blueprint name';
        }

        if (_.isEmpty(this.state.blueprintFileName)) {
            errors['blueprintFileName']='Please provide blueprint YAML file';
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        this.props.actions.doUpload(this.state.blueprintName,
                                    this.state.blueprintFileName,
                                    this.props.files.repo,
                                    this.state.visibility
        ).then(()=>{
            this.setState({errors: {}, loading: false});
            this.props.toolbox.getEventBus().trigger('blueprints:refresh');
            this.props.onHide();
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        let {Modal, CancelButton, ApproveButton, Icon, Form, VisibilityField} = Stage.Basic;
        let yamlFiles = _.map(this.state.yamlFiles, item => { return {text: item, value: item} });

        return (
            <div>
                <Modal open={this.props.open} onClose={()=>this.props.onHide()} className="uploadModal">
                    <Modal.Header>
                        <Icon name="upload"/> Upload blueprint from {this.state.repository}
                        <VisibilityField visibility={this.state.visibility} className="rightFloated"
                                      onVisibilityChange={(visibility)=>this.setState({visibility: visibility})}/>
                    </Modal.Header>

                    <Modal.Content>
                        <Form loading={this.state.loading} errors={this.state.errors}
                              onErrorsDismiss={() => this.setState({errors: {}})}>
                            <Form.Field label='Blueprint name' required
                                        error={this.state.errors.blueprintName}
                                        help='The package will be uploaded to the Manager as a Blueprint resource,
                                              under the name you specify here.'>
                                <Form.Input name='blueprintName'
                                            value={this.state.blueprintName} onChange={this._handleInputChange.bind(this)}/>
                            </Form.Field>
                            <Form.Field label='Blueprint YAML file' required
                                        error={this.state.errors.blueprintFileName}
                                        help='As you can have more than one yaml file in the archive,
                                              you need to specify which is the main one for your application.'>
                                <Form.Dropdown name='blueprintFileName' search selection options={yamlFiles}
                                               value={this.state.blueprintFileName} onChange={this._handleInputChange.bind(this)}/>
                            </Form.Field>
                        </Form>
                    </Modal.Content>

                    <Modal.Actions>
                        <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                        <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} content="Upload" icon="upload" color="green"/>
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
};
