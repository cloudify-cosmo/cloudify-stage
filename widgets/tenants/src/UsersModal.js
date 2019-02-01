/**
 * Created by jakubniezgoda on 01/02/2017.
 */

import Actions from './actions';

const RolesPicker = Stage.Common.RolesPicker;
const RolesUtil = Stage.Common.RolesUtil;

export default class UsersModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            ...UsersModal.initialState
        }
    }

    static initialState = {
        users: {},
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
        this._updateTenant();
        return false;
    }

    onCancel () {
        this.props.onHide();
        return true;
    }

    onRoleChange(user, role){
        var newUsers = Object.assign({}, this.state.users);
        newUsers[user] = role;
        this.setState({users: newUsers});
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.open && this.props.open) {

            var users = _.mapValues(_.pickBy(this.props.tenant.users, (rolesObj) => {
                return !_.isEmpty(rolesObj['tenant-role']);
            }), (rolesObj) => {
                return rolesObj['tenant-role'];
            });

            this.setState({
                ...UsersModal.initialState,
                users: users
            });
        }
    }

    _updateTenant() {
        // Disable the form
        this.setState({loading: true});

        var users = this.props.tenant.user_roles.direct;
        var usersList = Object.keys(users);
        var submitUsers = this.state.users;
        var submitUsersList = Object.keys(submitUsers);

        let usersToAdd = _.pick(submitUsers, _.difference(submitUsersList, usersList));
        let usersToRemove = _.difference(usersList, submitUsersList);
        let usersToUpdate = _.pickBy(submitUsers, (role, user) => {
            return users[user] && !_.isEqual(users[user], role);
        });

        let actions = new Actions(this.props.toolbox);
        actions.doHandleUsers(this.props.tenant.name, usersToAdd, usersToRemove, usersToUpdate).then(()=>{
            this.setState({errors: {}, loading: false});
            this.props.toolbox.refresh();
            this.props.toolbox.getEventBus().trigger('users:refresh');
            this.props.onHide();
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        var newUsers = {};
        _.forEach(field.value, (user) => {
            newUsers[user] = this.state.users[user] || RolesUtil.getDefaultRoleName(this.props.toolbox.getManager()._data.roles);
        });
        this.setState({users: newUsers});
    }

    render() {
        let {Modal, Icon, Form, ApproveButton, CancelButton} = Stage.Basic;

        let tenant = this.props.tenant;
        let users = _.map(this.props.users.items, (user) => { return {text: user.username, value: user.username, key: user.username} });

        return (
        <Modal open={this.props.open} onClose={()=>this.props.onHide()}>
            <Modal.Header>
                <Icon name="user"/> Edit users for tenant {tenant.name}
            </Modal.Header>

            <Modal.Content>
                <Form loading={this.state.loading} errors={this.state.errors}
                      onErrorsDismiss={() => this.setState({errors: {}})}>
                    <Form.Field>
                        <Form.Dropdown placeholder='Users' multiple selection options={users} name="users"
                                       value={Object.keys(this.state.users)} onChange={this._handleInputChange.bind(this)}/>
                    </Form.Field>
                    <RolesPicker onUpdate={this.onRoleChange.bind(this)} resources={this.state.users} resourceName="user" toolbox={this.props.toolbox}></RolesPicker>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} content="Save" icon="user" color="green"/>
            </Modal.Actions>
        </Modal>
        );
    }
};
