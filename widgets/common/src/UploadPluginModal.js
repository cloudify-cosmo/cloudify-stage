import PropTypes from 'prop-types';

/**
 * Created by kinneretzin on 05/10/2016.
 */

class UploadPluginModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {...UploadPluginModal.initialState}

        this.wagonFileRef = React.createRef();
        this.yamlFileRef = React.createRef();
    }

    static propTypes = {
        open: PropTypes.bool.isRequired,
        onHide: PropTypes.func.isRequired,
        toolbox: PropTypes.object.isRequired
    };

    static initialState = {
        loading: false,
        wagonUrl: '',
        wagonFile: null,
        yamlUrl: '',
        yamlFile: null,
        errors: {},
        visibility: Stage.Common.Consts.defaultVisibility
    }

    onApprove() {
        this._submitUpload();
        return false;
    }

    onCancel() {
        this.props.onHide();
        return true;
    }

    componentWillUpdate(prevProps, prevState) {
        if (!prevProps.open && this.props.open) {
            this.wagonFileRef.current && this.wagonFileRef.current.reset();
            this.yamlFileRef.current && this.yamlFileRef.current.reset();
            this.setState(UploadPluginModal.initialState);
        }
    }

    _submitUpload() {
        let wagonUrl = this.state.wagonFile ? '' : this.state.wagonUrl;
        let yamlUrl = this.state.yamlFile ? '' : this.state.yamlUrl;

        let errors = {};

        if (_.isEmpty(wagonUrl) && !this.state.wagonFile) {
            errors['wagonUrl']='Please select wagon file or provide URL to wagon file';
        }

        if (_.isEmpty(yamlUrl) && !this.state.yamlFile) {
            errors['yamlUrl']='Please select YAML file or provide URL to YAML file';
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        let actions = new Stage.Common.PluginActions(this.props.toolbox);
        actions.doUpload(this.state.visibility, wagonUrl, yamlUrl, this.state.wagonFile, this.state.yamlFile).then(()=>{
            this.setState({errors: {}, loading: false, open: false});
            this.props.onHide();
            this.props.toolbox.refresh();
        }).catch(err=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    _onWagonUrlFocus() {
        if (this.state.wagonFile) {
            this.wagonFileRef.current && this.wagonFileRef.current.reset();
            this._onWagonFileReset();
        }
    }

    _onWagonFileChange(file) {
        this.setState({errors: {}, wagonFile: file ? file : null, wagonUrl: file ? file.name : ''});
    }

    _onWagonFileReset() {
        this.setState({errors: {}, wagonFile: null, wagonUrl: ''});
    }

    _onYamlUrlFocus() {
        if (this.state.yamlFile) {
            this.yamlFileRef.current && this.yamlFileRef.current.reset();
            this._onYamlFileReset();
        }
    }

    _onYamlFileChange(file) {
        this.setState({errors: {}, yamlFile: file ? file : null, yamlUrl: file ? file.name : ''});
    }

    _onYamlFileReset() {
        this.setState({errors: {}, yamlFile: null, yamlUrl: ''});
    }

    render() {
        let {ApproveButton, CancelButton, Form, Icon, Label, Modal, VisibilityField} = Stage.Basic;

        return (
            <Modal open={this.props.open} onClose={this.props.onHide}>
                <Modal.Header>
                    <Icon name="upload"/> Upload plugin
                    <VisibilityField visibility={this.state.visibility} className="rightFloated"
                                  onVisibilityChange={(visibility)=>this.setState({visibility: visibility})}/>
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}
                          onErrorsDismiss={() => this.setState({errors: {}})}>

                        <Form.Field label="Wagon file" required
                                    error={this.state.errors.wagonUrl}>
                            <Form.UrlOrFile name="wagon" value={this.state.wagonUrl}
                                            placeholder="Provide the plugin's wagon file URL or click browse to select a file"
                                            onChangeUrl={this._handleInputChange.bind(this)}
                                            onFocusUrl={this._onWagonUrlFocus.bind(this)}
                                            onBlurUrl={()=>{}}
                                            onChangeFile={this._onWagonFileChange.bind(this)}
                                            onResetFile={this._onWagonFileReset.bind(this)}
                                            label={<Label>{!this.state.wagonFile ? 'URL' : 'File'}</Label>}
                                            fileInputRef={this.wagonFileRef}
                            />
                        </Form.Field>

                        <Form.Field label="YAML file" required
                                    error={this.state.errors.yamlUrl}>
                            <Form.UrlOrFile name="yaml" value={this.state.yamlUrl}
                                            placeholder="Provide the plugin's YAML file URL or click browse to select a file"
                                            onChangeUrl={this._handleInputChange.bind(this)}
                                            onFocusUrl={this._onYamlUrlFocus.bind(this)}
                                            onBlurUrl={()=>{}}
                                            onChangeFile={this._onYamlFileChange.bind(this)}
                                            onResetFile={this._onYamlFileReset.bind(this)}
                                            label={<Label>{!this.state.yamlFile ? 'URL' : 'File'}</Label>}
                                            fileInputRef={this.yamlFileRef}
                            />
                        </Form.Field>

                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} content="Upload" icon="upload" color="green"/>
                </Modal.Actions>
            </Modal>
        );
    }
};

Stage.defineCommon({
    name: 'UploadPluginModal',
    common: UploadPluginModal
});
