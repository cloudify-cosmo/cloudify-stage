/**
 * Created by kinneretzin on 05/10/2016.
 */

import Actions from './actions';

export default class UploadModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {...UploadModal.initialState, show: false}
    }

    static initialState = {
        loading: false,
        blueprintUrl: "",
        blueprintName: "",
        blueprintFileName: "",
        errors: {}
    }

    onApprove () {
        this.refs.uploadForm.submit();
        return false;
    }

    onDeny () {
        this.setState({show: false});
        return true;
    }

    _showModal() {
        this.setState({show: true});
    }

    componentWillUpdate(prevProps, prevState) {
        if (this.state.show && prevState.show != this.state.show) {
            this.refs.blueprintFile.reset();
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

        var actions = new Actions(this.props.toolbox);
        actions.doUpload(this.state.blueprintName,
                         this.state.blueprintFileName,
                         this.state.blueprintUrl,
                         blueprintFile).then(()=>{
            this.setState({loading: false, show: false});
            this.props.toolbox.refresh();
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        var {Modal, Button, Icon, Form} = Stage.Basic;

        return (
            <div>
                <Button content='Upload' icon='upload' labelPosition='left' onClick={this._showModal.bind(this)}/>

                <Modal show={this.state.show} onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)} loading={this.state.loading}>
                    <Modal.Header>
                        <Icon name="upload"/> Upload blueprint
                    </Modal.Header>

                    <Modal.Body>
                        <Form onSubmit={this._submitUpload.bind(this)} errors={this.state.errors} ref="uploadForm">
                            <Form.Group>
                                <Form.Field width="9" error={this.state.errors.blueprintUrl}>
                                    <Form.Input label="http://" placeholder="Enter blueprint url" name="blueprintUrl"
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
                        </Form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Modal.Cancel/>
                        <Modal.Approve label="Upload" icon="upload" className="green"/>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
};
