/**
 * Created by pposel on 31/01/2017.
 */

import Actions from './actions';

export default class RoleModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = RoleModal.initialState;
    }

    static initialState = {
        loading: false,
        role: "",
        errors: {}
    }

    onApprove () {
        this.refs.roleForm.submit();
        return false;
    }

    onDeny () {
        this.props.onHide();
        return true;
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.show && nextProps.show) {
            this.setState({...RoleModal.initialState, role: nextProps.user.role});
        }
    }

    _submitRole() {
        let errors = {};

        if (_.isEmpty(this.state.role)) {
            errors["role"]="Please provide user role";
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        var actions = new Actions(this.props.toolbox);
        actions.doSetRole(this.props.user.username, this.state.role).then(()=>{
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
        var {Modal, Icon, Form} = Stage.Basic;

        let roleOptions = [
            {text: Actions.USER_ROLE, value: Actions.USER_ROLE},
            {text: Actions.ADMIN_ROLE, value: Actions.ADMIN_ROLE},
            {text: Actions.SUSPENDED_ROLE, value: Actions.SUSPENDED_ROLE}
        ];

        var user = Object.assign({},{username:""}, this.props.user);

        return (
            <Modal show={this.props.show} onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)} loading={this.state.loading}>
                <Modal.Header>
                    <Icon name="male"/> Set role for {user.username}
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={this._submitRole.bind(this)} errors={this.state.errors} ref="roleForm">
                        <Form.Field error={this.state.errors.role}>
                            <Form.Dropdown selection name='role' placeholder="Role" options={roleOptions}
                                           value={this.state.role} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Modal.Cancel/>
                    <Modal.Approve label="Save" icon="male" className="green"/>
                </Modal.Footer>
            </Modal>
        );
    }
};
