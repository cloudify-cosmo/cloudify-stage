/**
 * Created by jakubniezgoda on 01/02/2017.
 */

import Actions from './actions';

let PropTypes = React.PropTypes;

export default class UsersModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            ...UsersModal.initialState
        }
    }

    static initialState = {
        users: [],
        loading: false,
        errors: {}
    }

    static propTypes = {
        tenant: PropTypes.object.isRequired,
        users: PropTypes.object.isRequired,
        toolbox: PropTypes.object.isRequired,
        onHide: PropTypes.func
    };

    static defaultProps = {
        onHide: ()=>{}
    };

    onApprove () {
        this.refs.editForm.submit();
        return false;
    }

    onDeny () {
        this.props.onHide();
        return true;
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.show && nextProps.show) {
            this.setState({
                ...UsersModal.initialState,
                users: nextProps.tenant.users
            });
        }
    }

    _updateTenant() {
        let errors = {};

        // Disable the form
        this.setState({loading: true});

        let usersToAdd = _.difference(this.state.users, this.props.tenant.users);
        let usersToRemove = _.difference(this.props.tenant.users, this.state.users);

        let actions = new Actions(this.props.toolbox);
        actions.doHandleUsers(this.props.tenant.name, usersToAdd, usersToRemove).then(()=>{
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
        let {Modal, Icon, Form} = Stage.Basic;

        let tenant = this.props.tenant;
        let users = _.map(this.props.users.items, (user) => { return {text: user.username, value: user.username, key: user.username} });

        return (
        <Modal show={this.props.show} loading={this.state.loading} onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)}>
            <Modal.Header>
                <Icon name="user"/> Modify users for tenant {tenant.name}
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={this._updateTenant.bind(this)} errors={this.state.errors} ref="editForm">
                    <Form.Field>
                        <Form.Dropdown placeholder='Users' multiple search selection options={users} name="users"
                                       value={this.state.users} onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Modal.Cancel/>
                <Modal.Approve label="Save" icon="user" className="green"/>
            </Modal.Footer>
        </Modal>
        );
    }
};
