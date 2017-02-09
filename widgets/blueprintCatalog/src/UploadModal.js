/**
 * Created by pposel on 07/02/2017.
 */

const UPLOAD_URL = (user,repo)=>`https://api.github.com/repos/${user}/${repo}/zipball/master`;

export default class UploadModal extends React.Component {

    constructor(props,context) {
        super(props,context);
        this.state = UploadModal.initialState;
    }

    static initialState = {
        loading: false,
        blueprintName: "",
        blueprintFileName: "",
        errors: {}
    }

    onApprove () {
        this.refs.uploadForm.submit();
        return false;
    }

    onDeny () {
        this.props.onHide();
        return true;
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.show && nextProps.show) {
            this.setState(UploadModal.initialState);
        }
    }

    _submitUpload() {
        let errors = {};

        if (_.isEmpty(this.state.blueprintName)) {
            errors["blueprintName"]="Please provide blueprint name";
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        this.props.actions.doUpload(this.state.blueprintName,
                                    this.state.blueprintFileName,
                                    UPLOAD_URL(this.props.actions.getUsername(), this.props.files.repo)
        ).then(()=>{
            this.setState({loading: false});
            this.props.toolbox.refresh();
            this.props.onHide();
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        var {Modal, Button, Icon, Form} = Stage.Basic;

        var files = Object.assign({},{tree:[], repo:""}, this.props.files);
        files.tree = _.filter(files.tree, x => x.type === "blob" && x.path.endsWith(".yaml"));

        var options = _.map(files.tree, item => { return {text: item.path, value: item.path} });

        return (
            <div>
                <Modal show={this.props.show} onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)} loading={this.state.loading}>
                    <Modal.Header>
                        <Icon name="upload"/> Upload blueprint from {files.repo}
                    </Modal.Header>

                    <Modal.Body>
                        <Form onSubmit={this._submitUpload.bind(this)} errors={this.state.errors} ref="uploadForm">
                            <Form.Field error={this.state.errors.blueprintName}>
                                <Form.Input name='blueprintName' placeholder="Blueprint name"
                                            value={this.state.blueprintName} onChange={this._handleInputChange.bind(this)}/>
                            </Form.Field>

                            <Form.Field>
                                <Form.Dropdown placeholder='Blueprint filename' search selection options={options} name="blueprintFileName"
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
