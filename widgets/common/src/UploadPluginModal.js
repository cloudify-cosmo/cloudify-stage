/**
 * Created by kinneretzin on 05/10/2016.
 */

class UploadPluginModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {...UploadPluginModal.initialState}
    }

    static initialState = {
        loading: false,
        wagonUrl: '',
        yamlUrl: '',
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

    _submitUpload() {
        let wagonFile = this.refs.wagonFile.file();
        let yamlFile = this.refs.yamlFile.file();

        let errors = {};

        if (_.isEmpty(this.state.wagonUrl) && !wagonFile) {
            errors['wagon']='Please select wagon file or url';
        }

        if (!_.isEmpty(this.state.wagonUrl) && wagonFile) {
            errors['wagon']='Either wagon file or url must be selected, not both';
        }

        if (_.isEmpty(this.state.yamlUrl) && !yamlFile) {
            errors['yaml']='Please select yaml file or url';
        }

        if (!_.isEmpty(this.state.yamlUrl) && yamlFile) {
            errors['yaml']='Either yaml file or url must be selected, not both';
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        let actions = new Stage.Common.PluginActions(this.props.toolbox);
        actions.doUpload(this.state.visibility, this.state.wagonUrl, this.state.yamlUrl, wagonFile, yamlFile).then(()=>{
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

    render() {
        let {Modal, Icon, Form, ApproveButton, CancelButton, VisibilityField} = Stage.Basic;

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

                        <Form.Group>
                            <Form.Field width="9" error={this.state.errors.wagon}>
                                <Form.Input label="URL" placeholder="Enter wagon url" name="wagonUrl"
                                            value={this.state.wagonUrl} onChange={this._handleInputChange.bind(this)}
                                            onBlur={()=>this.state.wagonUrl ? this.refs.wagonFile.reset() : ''}/>
                            </Form.Field>
                            <Form.Field width="1" style={{position:'relative'}}>
                                <div className="ui vertical divider">
                                    Or
                                </div>
                            </Form.Field>
                            <Form.Field width="8" error={this.state.errors.wagon}>
                                <Form.File placeholder="Select wagon file" name="wagonFile" ref="wagonFile"
                                           onChange={(file)=>file ? this.setState({wagonUrl: ''}) : ''}/>

                            </Form.Field>
                        </Form.Group>

                        <Form.Group>
                            <Form.Field width="9" error={this.state.errors.yaml}>
                                <Form.Input label="URL" placeholder="Enter yaml url" name="yamlUrl"
                                            value={this.state.yamlUrl} onChange={this._handleInputChange.bind(this)}
                                            onBlur={()=>this.state.yamlUrl ? this.refs.yamlFile.reset() : ''}/>
                            </Form.Field>
                            <Form.Field width="1" style={{position:'relative'}}>
                                <div className="ui vertical divider">
                                    Or
                                </div>
                            </Form.Field>
                            <Form.Field width="8" error={this.state.errors.yaml}>
                                <Form.File placeholder="Select yaml file" name="yamlFile" ref="yamlFile"
                                           onChange={(file)=>file ? this.setState({yamlUrl: ''}) : ''}/>

                            </Form.Field>
                        </Form.Group>

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
