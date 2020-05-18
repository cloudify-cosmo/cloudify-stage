/**
 * Created by jakubniezgoda on 03/02/2017.
 */
import Actions from './actions';
import MenuAction from './MenuAction';
import GroupDetails from './GroupDetails';
import CreateModal from './CreateModal';
import TenantsModal from './TenantsModal';
import UsersModal from './UsersModal';

export default class UserGroupsTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            error: null,
            showModal: false,
            modalType: '',
            group: {},
            tenants: {},
            users: {},
            settingGroupRoleLoading: false
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            !_.isEqual(this.props.widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(this.props.data, nextProps.data)
        );
    }

    refreshData() {
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('userGroups:refresh', this.refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('userGroups:refresh', this.refreshData);
    }

    fetchData(fetchParams) {
        return this.props.toolbox.refresh(fetchParams);
    }

    selectUserGroup(userGroup) {
        const selectedUserGroup = this.props.toolbox.getContext().getValue('userGroup');
        this.props.toolbox.getContext().setValue('userGroup', userGroup === selectedUserGroup ? null : userGroup);
    }

    getAvailableTenants(value, group) {
        this.props.toolbox.loading(true);

        const actions = new Actions(this.props.toolbox);
        actions
            .doGetTenants()
            .then(tenants => {
                this.setState({ error: null, group, tenants, modalType: value, showModal: true });
                this.props.toolbox.loading(false);
            })
            .catch(err => {
                this.setState({ error: err.message });
                this.props.toolbox.loading(false);
            });
    }

    getAvailableUsers(value, group) {
        this.props.toolbox.loading(true);

        const actions = new Actions(this.props.toolbox);
        actions
            .doGetUsers()
            .then(users => {
                this.setState({ error: null, group, users, modalType: value, showModal: true });
                this.props.toolbox.loading(false);
            })
            .catch(err => {
                this.setState({ error: err.message });
                this.props.toolbox.loading(false);
            });
    }

    showModal(value, group) {
        const actions = new Actions(this.props.toolbox);

        if (value === MenuAction.EDIT_TENANTS_ACTION) {
            this.getAvailableTenants(value, group);
        } else if (value === MenuAction.EDIT_USERS_ACTION) {
            this.getAvailableUsers(value, group);
        } else if (
            value === MenuAction.DELETE_ACTION ||
            (value === MenuAction.SET_DEFAULT_GROUP_ROLE_ACTION &&
                actions.isLogoutToBePerformed(group, this.props.data.items, group.users))
        ) {
            this.setState({ group, modalType: value, showModal: true });
        } else if (value === MenuAction.SET_ADMIN_GROUP_ROLE_ACTION) {
            this.setRole(group, true);
        } else if (value === MenuAction.SET_DEFAULT_GROUP_ROLE_ACTION) {
            this.setRole(group, false);
        } else {
            this.setState({ error: `Internal error: Unknown action ('${value}') cannot be handled.` });
        }
    }

    hideModal(newState) {
        this.setState({ showModal: false, ...newState });
    }

    handleError(message) {
        this.setState({ error: message });
    }

    deleteUserGroup() {
        this.props.toolbox.loading(true);

        const actions = new Actions(this.props.toolbox);
        actions
            .doDelete(this.state.group.name)
            .then(() => {
                if (actions.isLogoutToBePerformed(this.state.group, this.props.data.items, this.state.group.users)) {
                    this.props.toolbox.getEventBus().trigger('menu.users:logout');
                } else {
                    this.hideModal({ error: null });
                    this.props.toolbox.loading(false);
                    this.props.toolbox.refresh();
                    this.props.toolbox.getEventBus().trigger('users:refresh');
                    this.props.toolbox.getEventBus().trigger('tenants:refresh');
                }
            })
            .catch(err => {
                this.hideModal({ error: err.message });
                this.props.toolbox.loading(false);
            });
    }

    setRole(group, changeToAdmin) {
        this.props.toolbox.loading(true);
        this.setState({ settingGroupRoleLoading: group.name });

        const actions = new Actions(this.props.toolbox);
        actions
            .doSetRole(
                group.name,
                changeToAdmin ? Stage.Common.Consts.sysAdminRole : Stage.Common.Consts.defaultUserRole
            )
            .then(() => {
                this.setState({ error: null, settingGroupRoleLoading: false });
                this.props.toolbox.loading(false);
                if (this.state.modalType === MenuAction.SET_DEFAULT_GROUP_ROLE_ACTION && this.state.showModal) {
                    this.props.toolbox.getEventBus().trigger('menu.users:logout');
                } else {
                    this.props.toolbox.refresh();
                    this.props.toolbox.getEventBus().trigger('users:refresh');
                }
            })
            .catch(err => {
                this.setState({ error: err.message, settingGroupRoleLoading: false });
                this.props.toolbox.loading(false);
            });
    }

    render() {
        const NO_DATA_MESSAGE = 'There are no User Groups available. Click "Add" to add User Groups.';
        const { Checkbox, Confirm, DataTable, ErrorMessage, Label, Loader } = Stage.Basic;

        return (
            <div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({ error: null })} autoHide />

                <DataTable
                    fetchData={this.fetchData.bind(this)}
                    totalSize={this.props.data.total}
                    pageSize={this.props.widget.configuration.pageSize}
                    sortColumn={this.props.widget.configuration.sortColumn}
                    sortAscending={this.props.widget.configuration.sortAscending}
                    searchable
                    className="userGroupsTable"
                    noDataMessage={NO_DATA_MESSAGE}
                >
                    <DataTable.Column label="Group" name="name" width="35%" />
                    <DataTable.Column label="LDAP group" name="ldap_dn" width="20%" />
                    <DataTable.Column label="Admin" name="role" width="10%" />
                    <DataTable.Column label="# Users" width="10%" />
                    <DataTable.Column label="# Tenants" width="10%" />
                    <DataTable.Column label="" width="5%" />
                    {this.props.data.items.map(item => {
                        return (
                            <DataTable.RowExpandable key={item.name} expanded={item.isSelected}>
                                <DataTable.Row
                                    key={item.name}
                                    selected={item.isSelected}
                                    onClick={this.selectUserGroup.bind(this, item.name)}
                                >
                                    <DataTable.Data>{item.name}</DataTable.Data>
                                    <DataTable.Data>{item.ldap_dn}</DataTable.Data>
                                    <DataTable.Data className="center aligned">
                                        {this.state.settingGroupRoleLoading === item.name ? (
                                            <Loader active inline size="mini" />
                                        ) : (
                                            <Checkbox
                                                checked={item.isAdmin}
                                                onChange={() =>
                                                    item.isAdmin
                                                        ? this.showModal(MenuAction.SET_DEFAULT_GROUP_ROLE_ACTION, item)
                                                        : this.showModal(MenuAction.SET_ADMIN_GROUP_ROLE_ACTION, item)
                                                }
                                                onClick={e => {
                                                    e.stopPropagation();
                                                }}
                                            />
                                        )}
                                    </DataTable.Data>
                                    <DataTable.Data>
                                        <Label className="green" horizontal>
                                            {item.userCount}
                                        </Label>
                                    </DataTable.Data>
                                    <DataTable.Data>
                                        <Label className="blue" horizontal>
                                            {item.tenantCount}
                                        </Label>
                                    </DataTable.Data>
                                    <DataTable.Data className="center aligned">
                                        <MenuAction item={item} onSelectAction={this.showModal.bind(this)} />
                                    </DataTable.Data>
                                </DataTable.Row>
                                <DataTable.DataExpandable key={item.name}>
                                    <GroupDetails
                                        data={item}
                                        groups={this.props.data.items}
                                        toolbox={this.props.toolbox}
                                        onError={this.handleError.bind(this)}
                                    />
                                </DataTable.DataExpandable>
                            </DataTable.RowExpandable>
                        );
                    })}
                    <DataTable.Action>
                        <CreateModal roles={this.props.roles} toolbox={this.props.toolbox} />
                    </DataTable.Action>
                </DataTable>

                <UsersModal
                    open={this.state.modalType === MenuAction.EDIT_USERS_ACTION && this.state.showModal}
                    group={this.state.group}
                    groups={this.props.data.items}
                    users={this.state.users}
                    onHide={this.hideModal.bind(this)}
                    toolbox={this.props.toolbox}
                />

                <TenantsModal
                    open={this.state.modalType === MenuAction.EDIT_TENANTS_ACTION && this.state.showModal}
                    group={this.state.group}
                    tenants={this.state.tenants}
                    onHide={this.hideModal.bind(this)}
                    toolbox={this.props.toolbox}
                />

                <Confirm
                    content={`Are you sure you want to remove group ${this.state.group.name}?`}
                    open={this.state.modalType === MenuAction.DELETE_ACTION && this.state.showModal}
                    onConfirm={this.deleteUserGroup.bind(this)}
                    onCancel={this.hideModal.bind(this)}
                />

                <Confirm
                    content={
                        `You have administrator privileges from the '${this.state.group.name}' group. ` +
                        'Are you sure you want to remove administrator privileges from this group? ' +
                        'You will be logged out of the system so the changes take effect.'
                    }
                    open={this.state.modalType === MenuAction.SET_DEFAULT_GROUP_ROLE_ACTION && this.state.showModal}
                    onConfirm={this.setRole.bind(this, this.state.group, false)}
                    onCancel={this.hideModal.bind(this)}
                />
            </div>
        );
    }
}
