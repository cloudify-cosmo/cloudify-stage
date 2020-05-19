/**
 * Created by jakubniezgoda on 01/02/2017.
 */

import Actions from './actions';

const { RolesPicker } = Stage.Common;
const { RolesUtil } = Stage.Common;

export default class UsersModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            ...UsersModal.initialState
        };
    }

    static initialState = {
        users: {},
        loading: false,
        errors: {}
    };

    static propTypes = {
        tenant: PropTypes.object.isRequired,
        users: PropTypes.object.isRequired,
        toolbox: PropTypes.object.isRequired,
        onHide: PropTypes.func
    };

    static defaultProps = {
        onHide: () => {}
    };

    onApprove() {
        this.updateTenant();
        return false;
    }

    onCancel() {
        const { onHide } = this.props;
        onHide();
        return true;
    }

    onRoleChange(user, role) {
        const { users } = this.state;
        const newUsers = { ...users };
        newUsers[user] = role;
        this.setState({ users: newUsers });
    }

    componentDidUpdate(prevProps) {
        const { open, tenant } = this.props;
        if (!prevProps.open && open) {
            const users = _.mapValues(
                _.pickBy(tenant.users, rolesObj => {
                    return !_.isEmpty(rolesObj['tenant-role']);
                }),
                rolesObj => {
                    return rolesObj['tenant-role'];
                }
            );

            this.setState({
                ...UsersModal.initialState,
                users
            });
        }
    }

    updateTenant() {
        const { onHide, tenant, toolbox } = this.props;
        const { users: submitUsers } = this.state;
        // Disable the form
        this.setState({ loading: true });

        const users = tenant.user_roles.direct;
        const usersList = Object.keys(users);
        const submitUsersList = Object.keys(submitUsers);

        const usersToAdd = _.pick(submitUsers, _.difference(submitUsersList, usersList));
        const usersToRemove = _.difference(usersList, submitUsersList);
        const usersToUpdate = _.pickBy(submitUsers, (role, user) => {
            return users[user] && !_.isEqual(users[user], role);
        });

        const actions = new Actions(toolbox);
        actions
            .doHandleUsers(tenant.name, usersToAdd, usersToRemove, usersToUpdate)
            .then(() => {
                this.setState({ errors: {}, loading: false });
                toolbox.refresh();
                toolbox.getEventBus().trigger('users:refresh');
                onHide();
            })
            .catch(err => {
                this.setState({ errors: { error: err.message }, loading: false });
            });
    }

    handleInputChange(proxy, field) {
        const newUsers = {};
        _.forEach(field.value, user => {
            const { toolbox } = this.props;
            const { users } = this.state;
            newUsers[user] = users[user] || RolesUtil.getDefaultRoleName(toolbox.getManagerState().roles);
        });
        this.setState({ users: newUsers });
    }

    render() {
        const { errors, loading } = this.state;
        const { Modal, Icon, Form, ApproveButton, CancelButton } = Stage.Basic;

        const { tenant, onHide, open, toolbox, users: usersProp } = this.props;
        const users = _.map(usersProp.items, user => {
            return { text: user.username, value: user.username, key: user.username };
        });

        return (
            <Modal open={open} onClose={() => onHide()}>
                <Modal.Header>
                    <Icon name="user" /> Edit users for tenant {tenant.name}
                </Modal.Header>

                <Modal.Content>
                    <Form loading={loading} errors={errors} onErrorsDismiss={() => this.setState({ errors: {} })}>
                        <Form.Field>
                            <Form.Dropdown
                                placeholder="Users"
                                multiple
                                selection
                                options={users}
                                name="users"
                                value={Object.keys(users)}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>
                        <RolesPicker
                            onUpdate={this.onRoleChange.bind(this)}
                            resources={users}
                            resourceName="user"
                            toolbox={toolbox}
                        />
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={loading} />
                    <ApproveButton
                        onClick={this.onApprove.bind(this)}
                        disabled={loading}
                        content="Save"
                        icon="user"
                        color="green"
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}
