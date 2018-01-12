/**
 * Created by pposel on 31/01/2017.
 */

export default class RoleModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = RoleModal.initialState;
    }

    static initialState = {
        loading: false,
        role: '',
        errors: {}
    }

    onApprove () {
        this._submitRole();
        return false;
    }

    onCancel () {
        this.props.onHide();
        return true;
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.open && nextProps.open) {
            this.setState({...RoleModal.initialState, role: nextProps.resource.role});
        }
    }

    _submitRole() {
        let errors = {};

        if (_.isEmpty(this.state.role)) {
            errors['role']='Please provide a role';
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        this.props.onSetRole(this.props.resource.name, this.state.role).then(()=>{
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

    render() {
        var {Modal, Icon, Form, ApproveButton, CancelButton} = Stage.Basic;

        var resource = Object.assign({},{name:''}, this.props.resource);

        return (
            <Modal open={this.props.open} onClose={()=>this.props.onHide()} className='roleModal'>
                <Modal.Header>
                    <Icon name="male"/> Set role for {resource.name}
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}
                          onErrorsDismiss={() => this.setState({errors: {}})}>
                        <Form.Field error={this.state.errors.role}>
                            <Form.Dropdown selection name='role' placeholder="Role" options={this.props.roles}
                                           value={this.state.role} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} icon="male" color="green" />
                </Modal.Actions>
            </Modal>
        );
    }
};

Stage.defineCommon({
    name: 'RoleModal',
    common: RoleModal
});