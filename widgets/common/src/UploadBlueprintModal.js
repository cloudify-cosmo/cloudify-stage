/**
 * Created by kinneretzin on 05/10/2016.
 */

class UploadBlueprintModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {...UploadBlueprintModal.initialState, open: false};
        this.actions = new Stage.Common.BlueprintActions(props.toolbox);
    }

    static initialState = {
        loading: false,
        urlLoading: false,
        fileLoading: false,
        blueprintUrl: '',
        blueprintName: '',
        blueprintFileName: '',
        imageUrl: '',
        errors: {},
        yamlFiles: [],
        visibility: Stage.Common.Consts.defaultVisibility
    }

    onApprove () {
        this._submitUpload();
        return false;
    }

    onCancel () {
        this.props.onHide();
        return true;
    }

    componentWillUpdate(prevProps, prevState) {
        if (!prevState.open && this.state.open) {
            this.refs.blueprintFile && this.refs.blueprintFile.reset();
            this.refs.imageFile && this.refs.imageFile.reset();
            this.setState(UploadBlueprintModal.initialState);
        }
    }

    _submitUpload() {
        let blueprintFile = this.refs.blueprintFile.file();

        let errors = {};

        if (_.isEmpty(this.state.blueprintUrl) && !blueprintFile) {
            errors['blueprintUrl']='Please select blueprint file or url';
        }

        if (!_.isEmpty(this.state.blueprintUrl) && blueprintFile) {
            errors['blueprintUrl']='Either blueprint file or url must be selected, not both';
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
                         this.state.blueprintUrl,
                         blueprintFile,
                         this.state.imageUrl,
                         this.refs.imageFile.file(),
                         this.state.visibility).then(()=>{
            this.setState({errors: {}, loading: false, open: false});
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

        this.setState({urlLoading: true});
        this.refs.blueprintFile.reset();
        this.actions.doListYamlFiles(this.state.blueprintUrl).then((yamlFiles)=>{
            this.setState({yamlFiles, errors: {}, urlLoading: false});
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, urlLoading: false});
        });
    }

    _onBlueprintFileChange(file) {
        if (!file) {
            this.setState({yamlFiles: [], errors: {}});
            return;
        }

        this.setState({fileLoading: true, blueprintUrl: ''});
        this.actions.doListYamlFiles(null, file).then((yamlFiles)=>{
            this.setState({yamlFiles, errors: {}, fileLoading: false});
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, fileLoading: false});
        });
    }

    render() {
        let {ApproveButton, CancelButton, Form, Icon, Modal, Popup, VisibilityField} = Stage.Basic;
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
                        <Form loading={this.state.loading} errors={this.state.errors}
                              onErrorsDismiss={() => this.setState({errors: {}})}>
                            <Form.Group>
                                <Form.Field width="8" error={this.state.errors.blueprintUrl}>
                                    <Form.Input label="URL" placeholder="Enter blueprint package URL location" name="blueprintUrl"
                                                onChange={this._handleInputChange.bind(this)} value={this.state.blueprintUrl}
                                                onBlur={this._onBlueprintUrlBlur.bind(this)} loading={this.state.urlLoading}
                                                icon={this.state.urlLoading?'search':false} disabled={this.state.urlLoading} />
                                </Form.Field>
                                <Form.Field width="1" style={{position:'relative'}}>
                                    <div className="ui vertical divider">
                                        Or
                                    </div>
                                </Form.Field>
                                <Form.Field width="7" error={this.state.errors.blueprintUrl}>
                                    <Form.File placeholder="Select blueprint package file" name="blueprintFile" ref="blueprintFile"
                                               onChange={this._onBlueprintFileChange.bind(this)} loading={this.state.fileLoading}
                                               disabled={this.state.fileLoading}/>
                                </Form.Field>
                                <Form.Field width="1">
                                    <Popup trigger={<Icon name="help circle outline"/>} position='top left' wide
                                           content='The archive package must contain exactly one directory that includes a yaml file for the main blueprint.'/>
                                </Form.Field>
                            </Form.Group>

                            <Form.Group>
                                <Form.Field width="16" error={this.state.errors.blueprintName}>
                                    <Form.Input name='blueprintName' placeholder="Blueprint name"
                                                value={this.state.blueprintName} onChange={this._handleInputChange.bind(this)}/>
                                </Form.Field>
                                <Form.Field width="1">
                                    <Popup trigger={<Icon name="help circle outline"/>} position='top left' wide
                                           content='The package is uploaded to the Manager as a blueprint with the name you specify here.'/>
                                </Form.Field>
                            </Form.Group>
                            <Form.Group>
                                <Form.Field width="16">
                                    <Form.Dropdown placeholder='Blueprint filename' search selection options={options} name="blueprintFileName"
                                                   value={this.state.blueprintFileName} onChange={this._handleInputChange.bind(this)}/>
                                </Form.Field>
                                <Form.Field width="1">
                                    <Popup trigger={<Icon name="help circle outline"/>} position='top left' wide
                                           content='You must specify the blueprint yaml file for your environment because the archive can contain more than one yaml file.'/>
                                </Form.Field>
                            </Form.Group>

                            <Form.Group>
                                <Form.Field width="8" error={this.state.errors.imageUrl}>
                                    <Form.Input label="URL" placeholder="Enter blueprint icon image file (.png) URL location" name="imageUrl"
                                                value={this.state.imageUrl} onChange={this._handleInputChange.bind(this)}
                                                onBlur={()=>this.state.imageUrl ? this.refs.imageFile.reset() : ''}/>
                                </Form.Field>
                                <Form.Field width="1" style={{position:'relative'}}>
                                    <div className="ui vertical divider">
                                        Or
                                    </div>
                                </Form.Field>
                                <Form.Field width="7" error={this.state.errors.imageUrl}>
                                    <Form.File placeholder="Select blueprint icon image file (.png)" name="imageFile" ref="imageFile"
                                               onChange={(file)=>file ? this.setState({imageUrl: ''}) : ''}/>
                                </Form.Field>
                                <Form.Field width="1">
                                    <Popup trigger={<Icon name="help circle outline"/>} position='top left' wide
                                           content='(Optional) The blueprint icon file is shown with the blueprint in the local blueprint widget.'/>
                                </Form.Field>
                            </Form.Group>
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
