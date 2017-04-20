/**
 * Created by kinneretzin on 05/10/2016.
 */

export default class UploadModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {...UploadModal.initialState, open: false}
    }

    static initialState = {
        loading: false,
        blueprintUrl: "",
        blueprintName: "",
        blueprintFileName: "",
        imageUrl: "",
        errors: {}
    }

    onApprove () {
        this._submitUpload();
        return false;
    }

    onCancel () {
        this.setState({open: false});
        return true;
    }

    componentWillUpdate(prevProps, prevState) {
        if (!prevState.open && this.state.open) {
            this.refs.blueprintFile && this.refs.blueprintFile.reset();
            this.refs.imageFile && this.refs.imageFile.reset();
            this.setState(UploadModal.initialState);
        }
    }

    _submitUpload() {
        let blueprintFile = this.refs.blueprintFile.file();

        let errors = {};

        if (_.isEmpty(this.state.blueprintUrl) && !blueprintFile) {
            errors["blueprintUrl"]="Please select blueprint file or url";
        }

        if (!_.isEmpty(this.state.blueprintUrl) && blueprintFile) {
            errors["blueprintUrl"]="Either blueprint file or url must be selected, not both";
        }

        if (_.isEmpty(this.state.blueprintName)) {
            errors["blueprintName"]="Please provide blueprint name";
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        var actions = new Stage.Common.BlueprintActions(this.props.toolbox);
        actions.doUpload(this.state.blueprintName,
                         this.state.blueprintFileName,
                         this.state.blueprintUrl,
                         blueprintFile,
                         this.state.imageUrl,
                         this.refs.imageFile.file()).then(()=>{
            this.setState({loading: false, open: false});
            this.props.toolbox.refresh();
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        var {Modal, Button, Icon, Form, ApproveButton, CancelButton} = Stage.Basic;
        const uploadButton = <Button content='Upload' icon='upload' labelPosition='left' />;

        return (
            <div>
                <Modal trigger={uploadButton} open={this.state.open} onOpen={()=>this.setState({open:true})} onClose={()=>this.setState({open:false})}>
                    <Modal.Header>
                        <Icon name="upload"/> Upload blueprint
                    </Modal.Header>

                    <Modal.Content>
                        <Form loading={this.state.loading} errors={this.state.errors}>
                            <Form.Group>
                                <Form.Field width="9" error={this.state.errors.blueprintUrl}>
                                    <Form.Input label="URL" placeholder="Enter blueprint url" name="blueprintUrl"
                                                value={this.state.blueprintUrl} onChange={this._handleInputChange.bind(this)}/>
                                </Form.Field>
                                <Form.Field width="1" style={{position:'relative'}}>
                                    <div className="ui vertical divider">
                                        Or
                                    </div>
                                </Form.Field>
                                <Form.Field width="8" error={this.state.errors.blueprintUrl}>
                                    <Form.File placeholder="Select blueprint file" name="blueprintFile" ref="blueprintFile"/>
                                </Form.Field>
                            </Form.Group>

                            <Form.Field error={this.state.errors.blueprintName}>
                                <Form.Input name='blueprintName' placeholder="Blueprint name"
                                            value={this.state.blueprintName} onChange={this._handleInputChange.bind(this)}/>
                            </Form.Field>

                            <Form.Field>
                                <Form.Input name='blueprintFileName' placeholder="Blueprint filename e.g. blueprint"
                                            value={this.state.blueprintFileName} onChange={this._handleInputChange.bind(this)}/>
                            </Form.Field>

                            <Form.Group>
                                <Form.Field width="9" error={this.state.errors.imageUrl}>
                                    <Form.Input label="URL" placeholder="Enter image url" name="imageUrl"
                                                value={this.state.imageUrl} onChange={this._handleInputChange.bind(this)}/>
                                </Form.Field>
                                <Form.Field width="1" style={{position:'relative'}}>
                                    <div className="ui vertical divider">
                                        Or
                                    </div>
                                </Form.Field>
                                <Form.Field width="8" error={this.state.errors.imageUrl}>
                                    <Form.File placeholder="Select image file" name="imageFile" ref="imageFile"/>
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
