/**
 * Created by kinneretzin on 05/10/2016.
 */

import Actions from './actions.js';

export default class UploadModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {...UploadModal.initialState, open: false}
    }

    static initialState = {
        loading: false,
        pluginUrl: '',
        errors: {},
        privateResource: false
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
            this.setState(UploadModal.initialState);
        }
    }

    _submitUpload() {
        let pluginFile = this.refs.pluginFile.file();

        let errors = {};

        if (_.isEmpty(this.state.pluginUrl) && !pluginFile) {
            errors['pluginUrl']='Please select plugin file or url';
        }

        if (!_.isEmpty(this.state.pluginUrl) && pluginFile) {
            errors['pluginUrl']='Either plugin file or url must be selected, not both';
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        var actions = new Actions(this.props.toolbox);
        actions.doUpload(this.state.pluginUrl, pluginFile, this.state.privateResource).then(()=>{
            this.setState({errors: {}, loading: false, open: false});
            this.props.toolbox.refresh();
        }).catch(err=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        var {Modal, Button, Icon, Form, ApproveButton, CancelButton, PrivateField} = Stage.Basic;
        const uploadButton = <Button content='Upload' icon='upload' labelPosition='left' />;

        return (
            <Modal trigger={uploadButton} open={this.state.open} onOpen={()=>this.setState({open:true})} onClose={()=>this.setState({open:false})}>
                <Modal.Header>
                    <Icon name="upload"/> Upload plugin
                    <PrivateField lock={this.state.privateResource} className="rightFloated"
                                  onClick={()=>this.setState({privateResource:!this.state.privateResource})}/>
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}
                          onErrorsDismiss={() => this.setState({errors: {}})}>

                        <Form.Group>
                            <Form.Field width="9" error={this.state.errors.pluginUrl}>
                                <Form.Input label="URL" placeholder="Enter plugin url" name="pluginUrl"
                                            value={this.state.pluginUrl} onChange={this._handleInputChange.bind(this)}
                                            onBlur={()=>this.state.pluginUrl ? this.refs.pluginFile.reset() : ''}/>
                            </Form.Field>
                            <Form.Field width="1" style={{position:'relative'}}>
                                <div className="ui vertical divider">
                                    Or
                                </div>
                            </Form.Field>
                            <Form.Field width="8" error={this.state.errors.pluginUrl}>
                                <Form.File placeholder="Select plugin file" name="pluginFile" ref="pluginFile"
                                           onChange={(file)=>file ? this.setState({pluginUrl: ''}) : ''}/>

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
