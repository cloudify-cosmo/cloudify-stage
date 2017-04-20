/**
 * Created by pposel on 07/02/2017.
 */

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
        this._submitUpload()
        return false;
    }

    onCancel () {
        this.props.onHide();
        return true;
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.open && nextProps.open) {
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
                                    this.props.files.repo
        ).then(()=>{
            this.setState({loading: false});
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
        var {Modal, CancelButton, ApproveButton, Icon, Form} = Stage.Basic;

        var files = Object.assign({},{tree:[], repo:""}, this.props.files);
        files.tree = _.filter(files.tree, x => x.type === "blob" && x.path.endsWith(".yaml"));

        var options = _.map(files.tree, item => { return {text: item.path, value: item.path} });

        return (
            <div>
                <Modal open={this.props.open}>
                    <Modal.Header>
                        <Icon name="upload"/> Upload blueprint from {files.repo}
                    </Modal.Header>

                    <Modal.Content>
                        <Form loading={this.state.loading} errors={this.state.errors}>
                            <Form.Field error={this.state.errors.blueprintName}>
                                <Form.Input name='blueprintName' placeholder="Blueprint name"
                                            value={this.state.blueprintName} onChange={this._handleInputChange.bind(this)}/>
                            </Form.Field>

                            <Form.Field>
                                <Form.Dropdown placeholder='Blueprint filename' search selection options={options}
                                               name="blueprintFileName"
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
