/**
 * Created by pposel on 30/01/2017.
 */
import Actions from './actions';
import CreateModal from './CreateModal';
import GroupModal from './GroupModal';
import MenuAction from './MenuAction';
import TenantModal from './TenantModal';
import UserDetails from './UserDetails';
import UserPropType from './props/UserPropType';

function IsAdminCheckbox({ user, disabled, onAdminUserChange, onDefaultUserChange }) {
    const { Checkbox } = Stage.Basic;
    return (
        <Checkbox
            checked={user.isAdmin}
            disabled={disabled || user.username === Stage.Common.Consts.adminUsername}
            onChange={() => (user.isAdmin ? onDefaultUserChange() : onAdminUserChange())}
            onClick={e => e.stopPropagation()}
        />
    );
}

IsAdminCheckbox.propTypes = {
    user: PropTypes.shape({
        username: PropTypes.string,
        isAdmin: PropTypes.bool
    }).isRequired,
    onAdminUserChange: PropTypes.func.isRequired,
    onDefaultUserChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};
IsAdminCheckbox.defaultProps = {
    disabled: false
};

function EnhancedIsAdminCheckbox({ user, settingUserRoleLoading, onAdminUserChange, onDefaultUserChange }) {
    const { Loader, Popup } = Stage.Basic;
    const isUserInAdminGroup = _.has(user.group_system_roles, Stage.Common.Consts.sysAdminRole);
    const isUserAnAdminUser = user.username === Stage.Common.Consts.adminUsername;

    if (settingUserRoleLoading === user.username) {
        return <Loader active inline size="mini" />;
    }
    if (isUserInAdminGroup && !isUserAnAdminUser) {
        return (
            <Popup>
                <Popup.Trigger>
                    <IsAdminCheckbox
                        disabled
                        user={user}
                        onAdminUserChange={onAdminUserChange}
                        onDefaultUserChange={onDefaultUserChange}
                    />
                </Popup.Trigger>
                <Popup.Content>
                    To remove the administrator privileges for this user, remove the user from the group that is
                    assigned administrator privileges.
                </Popup.Content>
            </Popup>
        );
    }
    return (
        <IsAdminCheckbox user={user} onAdminUserChange={onAdminUserChange} onDefaultUserChange={onDefaultUserChange} />
    );
}

EnhancedIsAdminCheckbox.propTypes = {
    user: PropTypes.shape({
        username: PropTypes.string,
        group_system_roles: PropTypes.arrayOf(PropTypes.string),
        isAdmin: PropTypes.bool
    }).isRequired,
    settingUserRoleLoading: PropTypes.string.isRequired,
    onAdminUserChange: PropTypes.func.isRequired,
    onDefaultUserChange: PropTypes.func.isRequired
};

export default class UsersTable extends React.Component {
    static EMPTY_USER = { username: '' };

    constructor(props, context) {
        super(props, context);

        this.state = {
            error: null,
            showModal: false,
            modalType: '',
            user: UsersTable.EMPTY_USER,
            tenants: {},
            groups: {},
            activateLoading: false,
            settingUserRoleLoading: false
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('users:refresh', this.refreshData, this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { data, widget } = this.props;
        return (
            !_.isEqual(widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(data, nextProps.data)
        );
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().off('users:refresh', this.refreshData);
    }

    getAvailableTenants(value, user, showModal = true) {
        const { toolbox } = this.props;
        toolbox.loading(true);

        const actions = new Actions(toolbox);
        actions
            .doGetTenants()
            .then(tenants => {
                this.setState({
                    error: null,
                    tenants,
                    user: showModal ? user : UsersTable.EMPTY_USER,
                    modalType: showModal ? value : '',
                    showModal
                });
                toolbox.loading(false);
            })
            .catch(err => {
                this.setState({ error: err.message });
                toolbox.loading(false);
            });
    }

    getAvailableGroups(value, user) {
        const { toolbox } = this.props;
        toolbox.loading(true);

        const actions = new Actions(toolbox);
        actions
            .doGetGroups()
            .then(groups => {
                this.setState({ error: null, user, groups, modalType: value, showModal: true });
                toolbox.loading(false);
            })
            .catch(err => {
                this.setState({ error: err.message });
                toolbox.loading(false);
            });
    }

    setRole(user, isAdmin) {
        const { toolbox } = this.props;
        toolbox.loading(true);
        this.setState({ settingUserRoleLoading: user.username });

        const actions = new Actions(toolbox);
        actions
            .doSetRole(user.username, Stage.Common.RolesUtil.getSystemRole(isAdmin))
            .then(() => {
                this.setState({ error: null, settingUserRoleLoading: false });
                toolbox.loading(false);
                if (this.isCurrentUser(user) && !isAdmin) {
                    toolbox.getEventBus().trigger('menu.users:logout');
                } else {
                    toolbox.refresh();
                }
            })
            .catch(err => {
                this.setState({ error: err.message, settingUserRoleLoading: false });
                toolbox.loading(false);
            });
    }

    fetchData = fetchParams => {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };

    showModal = (value, user) => {
        if (value === MenuAction.EDIT_TENANTS_ACTION) {
            this.getAvailableTenants(value, user);
        } else if (value === MenuAction.EDIT_GROUPS_ACTION) {
            this.getAvailableGroups(value, user);
        } else if (value === MenuAction.ACTIVATE_ACTION) {
            this.activateUser(user);
        } else if (value === MenuAction.DEACTIVATE_ACTION && !this.isCurrentUser(user)) {
            this.deactivateUser(user);
        } else if (value === MenuAction.SET_ADMIN_USER_ROLE_ACTION) {
            this.setRole(user, true);
        } else if (value === MenuAction.SET_DEFAULT_USER_ROLE_ACTION && !this.isCurrentUser(user)) {
            this.setRole(user, false);
        } else {
            this.setState({ user, modalType: value, showModal: true });
        }
    };

    hideModal = () => {
        this.setState({ showModal: false });
    };

    handleError = message => {
        this.setState({ error: message });
    };

    deleteUser = () => {
        const { toolbox } = this.props;
        const { user } = this.state;
        toolbox.loading(true);

        const actions = new Actions(toolbox);
        actions
            .doDelete(user.username)
            .then(() => {
                this.hideModal();
                this.setState({ error: null });
                toolbox.loading(false);
                toolbox.refresh();
            })
            .catch(err => {
                this.hideModal();
                this.setState({ error: err.message });
                toolbox.loading(false);
            });
    };

    selectUser(userName) {
        const { toolbox } = this.props;
        const selectedUserName = toolbox.getContext().getValue('userName');
        toolbox.getContext().setValue('userName', userName === selectedUserName ? null : userName);
    }

    deactivateUser(user) {
        const { toolbox } = this.props;
        toolbox.loading(true);
        this.setState({ activateLoading: user.username });

        const actions = new Actions(toolbox);
        actions
            .doDeactivate(user.username)
            .then(() => {
                this.setState({ error: null, activateLoading: false });
                toolbox.loading(false);
                if (this.isCurrentUser(user)) {
                    toolbox.getEventBus().trigger('menu.users:logout');
                } else {
                    toolbox.refresh();
                    toolbox.getEventBus().trigger('userGroups:refresh');
                }
            })
            .catch(err => {
                this.setState({ error: err.message, activateLoading: false });
                toolbox.loading(false);
            });
    }

    refreshData() {
        const { toolbox } = this.props;
        toolbox.refresh();
    }

    isCurrentUser(user) {
        const { toolbox } = this.props;
        return toolbox.getManager().getCurrentUsername() === user.username;
    }

    activateUser(user) {
        const { toolbox } = this.props;
        toolbox.loading(true);
        this.setState({ activateLoading: user.username });

        const actions = new Actions(toolbox);
        actions
            .doActivate(user.username)
            .then(() => {
                this.setState({ error: null, activateLoading: false });
                toolbox.loading(false);
                toolbox.refresh();
            })
            .catch(err => {
                this.setState({ error: err.message, activateLoading: false });
                toolbox.loading(false);
            });
    }

    render() {
        const {
            activateLoading,
            error,
            groups,
            modalType,
            settingUserRoleLoading,
            showModal,
            tenants,
            user
        } = this.state;
        const { data, toolbox, widget } = this.props;
        const NO_DATA_MESSAGE = 'There are no Users available in manager. Click "Add" to add Users.';
        const { Checkbox, Confirm, DataTable, ErrorMessage, Label, Loader } = Stage.Basic;
        const { PasswordModal } = Stage.Shared;
        const tableName = 'usersTable';

        return (
            <div>
                <ErrorMessage error={error} onDismiss={() => this.setState({ error: null })} autoHide />

                <DataTable
                    fetchData={this.fetchData}
                    totalSize={data.total}
                    pageSize={widget.configuration.pageSize}
                    sortColumn={widget.configuration.sortColumn}
                    sortAscending={widget.configuration.sortAscending}
                    searchable
                    className={tableName}
                    noDataMessage={NO_DATA_MESSAGE}
                >
                    <DataTable.Column label="Username" name="username" width="37%" />
                    <DataTable.Column label="Last login" name="last_login_at" width="18%" />
                    <DataTable.Column label="Admin" width="10%" />
                    <DataTable.Column label="Active" name="active" width="10%" />
                    <DataTable.Column label="# Groups" width="10%" />
                    <DataTable.Column label="# Tenants" width="10%" />
                    <DataTable.Column label="" width="5%" />
                    {data.items.map(item => (
                        <DataTable.RowExpandable key={item.username} expanded={item.isSelected}>
                            <DataTable.Row
                                id={`${tableName}_${item.username}`}
                                key={item.username}
                                selected={item.isSelected}
                                onClick={() => this.selectUser(item.username)}
                            >
                                <DataTable.Data>{item.username}</DataTable.Data>
                                <DataTable.Data>{item.last_login_at}</DataTable.Data>
                                <DataTable.Data className="center aligned">
                                    <EnhancedIsAdminCheckbox
                                        onAdminUserChange={() =>
                                            this.showModal(MenuAction.SET_ADMIN_USER_ROLE_ACTION, item)
                                        }
                                        onDefaultUserChange={() =>
                                            this.showModal(MenuAction.SET_DEFAULT_USER_ROLE_ACTION, item)
                                        }
                                        user={item}
                                        settingUserRoleLoading={settingUserRoleLoading}
                                    />
                                </DataTable.Data>
                                <DataTable.Data className="center aligned">
                                    {activateLoading === item.username ? (
                                        <Loader active inline size="mini" />
                                    ) : (
                                        <Checkbox
                                            checked={item.active}
                                            onChange={() =>
                                                item.active
                                                    ? this.showModal(MenuAction.DEACTIVATE_ACTION, item)
                                                    : this.showModal(MenuAction.ACTIVATE_ACTION, item)
                                            }
                                            onClick={e => {
                                                e.stopPropagation();
                                            }}
                                        />
                                    )}
                                </DataTable.Data>
                                <DataTable.Data>
                                    <Label className="green" horizontal>
                                        {item.groupCount}
                                    </Label>
                                </DataTable.Data>
                                <DataTable.Data>
                                    <Label className="blue" horizontal>
                                        {item.tenantCount}
                                    </Label>
                                </DataTable.Data>
                                <DataTable.Data className="center aligned">
                                    <MenuAction item={item} onSelectAction={this.showModal} />
                                </DataTable.Data>
                            </DataTable.Row>
                            <DataTable.DataExpandable key={item.username}>
                                <UserDetails data={item} toolbox={toolbox} onError={this.handleError} />
                            </DataTable.DataExpandable>
                        </DataTable.RowExpandable>
                    ))}
                    <DataTable.Action>
                        <CreateModal toolbox={toolbox} />
                    </DataTable.Action>
                </DataTable>

                <PasswordModal
                    open={modalType === MenuAction.CHANGE_PASSWORD_ACTION && showModal}
                    onHide={this.hideModal}
                    username={user.username}
                />

                <TenantModal
                    open={modalType === MenuAction.EDIT_TENANTS_ACTION && showModal}
                    user={user}
                    tenants={tenants}
                    onHide={this.hideModal}
                    toolbox={toolbox}
                />

                <GroupModal
                    open={modalType === MenuAction.EDIT_GROUPS_ACTION && showModal}
                    user={user}
                    groups={groups}
                    onHide={this.hideModal}
                    toolbox={toolbox}
                />

                <Confirm
                    content={`Are you sure you want to remove user ${user.username}?`}
                    open={modalType === MenuAction.DELETE_ACTION && showModal}
                    onConfirm={this.deleteUser}
                    onCancel={this.hideModal}
                />

                <Confirm
                    content={
                        'Are you sure you want to remove your administrator privileges? ' +
                        'You will be logged out of the system so the changes take effect.'
                    }
                    open={modalType === MenuAction.SET_DEFAULT_USER_ROLE_ACTION && showModal}
                    onConfirm={() => this.setRole(user, false)}
                    onCancel={this.hideModal}
                />

                <Confirm
                    content="Are you sure you want to deactivate current user and log out?"
                    open={modalType === MenuAction.DEACTIVATE_ACTION && showModal}
                    onConfirm={() => this.deactivateUser(user)}
                    onCancel={this.hideModal}
                />
            </div>
        );
    }
}

UsersTable.propTypes = {
    data: PropTypes.shape({ items: PropTypes.arrayOf(UserPropType), total: PropTypes.number }).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    widget: Stage.PropTypes.Widget.isRequired
};
