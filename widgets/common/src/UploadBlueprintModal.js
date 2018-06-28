/**
 * Created by kinneretzin on 05/10/2016.
 */

class UploadBlueprintModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {...UploadBlueprintModal.initialState};

        this.blueprintFileRef = React.createRef();
        this.imageFileRef = React.createRef();

        this.actions = new Stage.Common.BlueprintActions(props.toolbox);
    }

    static initialState = {
        loading: false,
        urlLoading: false,
        fileLoading: false,
        blueprintUrl: '',
        blueprintFile: null,
        blueprintName: '',
        blueprintFileName: '',
        imageUrl: '',
        imageFile: null,
        errors: {},
        yamlFiles: [],
        visibility: Stage.Common.Consts.defaultVisibility
    };

    static DEFAULT_BLUEPRINT_YAML_FILE = 'blueprint.yaml';

    onApprove () {
        this._submitUpload();
        return false;
    }

    onCancel () {
        this.props.onHide();
        return true;
    }

    componentWillUpdate(prevProps, prevState) {
        if (!prevProps.open && this.props.open) {
            this.blueprintFileRef.current && this.blueprintFileRef.current.reset();
            this.imageFileRef.current && this.imageFileRef.current.reset();
            this.setState(UploadBlueprintModal.initialState);
        }
    }

    _submitUpload() {
        let blueprintUrl = this.state.blueprintFile ? '' : this.state.blueprintUrl;
        let imageUrl = this.state.imageFile ? '' : this.state.imageUrl;

        let errors = {};

        if (_.isEmpty(blueprintUrl) && !this.state.blueprintFile) {
            errors['blueprintUrl']='Please select blueprint file or url';
        }

        if (_.isEmpty(this.state.blueprintName)) {
            errors['blueprintName']='Please provide blueprint name';
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        this.actions.doUpload(this.state.blueprintName,
                         this.state.blueprintFileName,
                         blueprintUrl, this.state.blueprintFile,
                         imageUrl, this.state.imageFile,
                         this.state.visibility).then(()=>{
            this.setState({errors: {}, loading: false});
            this.props.toolbox.refresh();
            this.props.onHide();
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    _onBlueprintUrlBlur() {
        if (!this.state.blueprintUrl) {
            this.setState({yamlFiles: [], errors: {}});
            return;
        }

        this.setState({urlLoading: true, blueprintFile: null});
        this.blueprintFileRef.current && this.blueprintFileRef.current.reset();
        this.actions.doListYamlFiles(this.state.blueprintUrl, null, true).then((data)=>{
            let blueprintName = data.shift();
            let blueprintFileName
                = _.includes(data, UploadBlueprintModal.DEFAULT_BLUEPRINT_YAML_FILE)
                ? UploadBlueprintModal.DEFAULT_BLUEPRINT_YAML_FILE
                : data[0];
            this.setState({yamlFiles: data, errors: {}, urlLoading: false, blueprintName, blueprintFileName});
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, urlLoading: false, blueprintName: '', blueprintFileName: ''});
        });
    }

    _onBlueprintUrlFocus() {
        if (this.state.blueprintFile) {
            this.blueprintFileRef.current && this.blueprintFileRef.current.reset();
            this._onBlueprintFileReset();
        }
    }

    _onBlueprintFileChange(file) {
        if (!file) {
            this.setState({yamlFiles: [], errors: {}});
            return;
        }

        this.setState({fileLoading: true});
        this.actions.doListYamlFiles(null, file, true).then((data)=>{
            let blueprintName = data.shift();
            let blueprintFileName
                = _.includes(data, UploadBlueprintModal.DEFAULT_BLUEPRINT_YAML_FILE)
                ? UploadBlueprintModal.DEFAULT_BLUEPRINT_YAML_FILE
                : data[0];
            this.setState({yamlFiles: data, errors: {}, fileLoading: false, blueprintFile: file, blueprintUrl: file.name, blueprintName, blueprintFileName});
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, fileLoading: false, blueprintName: '', blueprintFileName: ''});
        });
    }

    _onBlueprintFileReset() {
        this.setState({yamlFiles: [], errors: {}, blueprintFile: null, blueprintUrl: '', blueprintName: '', blueprintFileName: ''});
    }

    _onBlueprintImageUrlFocus() {
        if (this.state.imageFile) {
            this.imageFileRef.current && this.imageFileRef.current.reset();
            this._onBlueprintImageReset();
        }
    }

    _onBlueprintImageChange(file) {
        if (file) {
            this.setState({imageUrl: file.name, imageFile: file});
        }
    }

    _onBlueprintImageReset() {
        this.setState({imageUrl: '', imageFile: null});
    }

    render() {
        let {ApproveButton, CancelButton, Form, Icon, Label, Modal, VisibilityField} = Stage.Basic;
        let options = _.map(this.state.yamlFiles, item => { return {text: item, value: item} });

        return (
            <div>
                <Modal open={this.props.open} onClose={()=>this.props.onHide()} className="uploadBlueprintModal">
                    <Modal.Header>
                        <Icon name="upload"/> Upload blueprint
                        <VisibilityField visibility={this.state.visibility} className="rightFloated"
                                      onVisibilityChange={(visibility)=>this.setState({visibility: visibility})}/>
                    </Modal.Header>

                    <Modal.Content>
                        <Form loading={this.state.loading || this.state.urlLoading || this.state.fileLoading} errors={this.state.errors}
                              onErrorsDismiss={() => this.setState({errors: {}})}>

                            <Form.Field label='Blueprint package' required
                                        error={this.state.errors.blueprintUrl}
                                        help='The archive package must contain exactly one directory
                                              that includes a yaml file for the main blueprint.'>
                                <Form.UrlOrFile name="blueprint" value={this.state.blueprintUrl}
                                                placeholder="Provide the blueprint's URL or click browse to select a file"
                                                onChangeUrl={this._handleInputChange.bind(this)}
                                                onFocusUrl={this._onBlueprintUrlFocus.bind(this)}
                                                onBlurUrl={this._onBlueprintUrlBlur.bind(this)}
                                                onChangeFile={this._onBlueprintFileChange.bind(this)}
                                                onResetFile={this._onBlueprintFileReset.bind(this)}
                                                label={<Label>{!this.state.blueprintFile ? 'URL' : 'File'}</Label>}
                                                fileInputRef={this.blueprintFileRef}
                                />
                            </Form.Field>

                            <Form.Field label='Blueprint name' required
                                        error={this.state.errors.blueprintName}
                                        help='The package is uploaded to the Manager as a blueprint with the name you specify here.'>
                                <Form.Input name='blueprintName'
                                            value={this.state.blueprintName}
                                            onChange={this._handleInputChange.bind(this)}/>
                            </Form.Field>

                            <Form.Field label='Blueprint YAML file' required
                                        help='You must specify the blueprint yaml file for your environment
                                              because the archive can contain more than one yaml file.'>
                                <Form.Dropdown name="blueprintFileName" search selection options={options}
                                               value={this.state.blueprintFileName} onChange={this._handleInputChange.bind(this)}/>
                            </Form.Field>

                            <Form.Field label='Blueprint image'
                                        error={this.state.errors.imageUrl}
                                        help='(Optional) The blueprint icon file is shown with the blueprint in the local blueprint widget.'>
                                <Form.UrlOrFile name="image" value={this.state.imageUrl}
                                                placeholder="Provide the image file URL or click browse to select a file"
                                                onChangeUrl={this._handleInputChange.bind(this)}
                                                onFocusUrl={this._onBlueprintImageUrlFocus.bind(this)}
                                                onBlurUrl={() => {}}
                                                onChangeFile={this._onBlueprintImageChange.bind(this)}
                                                onResetFile={this._onBlueprintImageReset.bind(this)}
                                                label={<Label>{!this.state.imageFile ? 'URL' : 'File'}</Label>}
                                                fileInputRef={this.imageFileRef}
                                />
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

Stage.defineCommon({
    name: 'UploadBlueprintModal',
    common: UploadBlueprintModal
});
