/**
 * Created by jakubniezgoda on 03/02/2017.
 */
import Actions from './actions';
import CreateModal from './CreateModal';
import GroupDetails from './GroupDetails';
import MenuAction from './MenuAction';
import TenantsModal from './TenantsModal';
import UsersModal from './UsersModal';
import GroupPropType from './props/GroupPropType';

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
        const { data, widget } = this.props;
        return (
            !_.isEqual(widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(data, nextProps.data)
        );
    }

    refreshData() {
        const { toolbox } = this.props;
        toolbox.refresh();
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('userGroups:refresh', this.refreshData, this);
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().off('userGroups:refresh', this.refreshData);
    }

    fetchData(fetchParams) {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    }

    selectUserGroup(userGroup) {
        const { toolbox } = this.props;
        const selectedUserGroup = toolbox.getContext().getValue('userGroup');
        toolbox.getContext().setValue('userGroup', userGroup === selectedUserGroup ? null : userGroup);
    }

    getAvailableTenants(value, group) {
        const { toolbox } = this.props;
        toolbox.loading(true);

        const actions = new Actions(toolbox);
        actions
            .doGetTenants()
            .then(tenants => {
                this.setState({ error: null, group, tenants, modalType: value, showModal: true });
                toolbox.loading(false);
            })
            .catch(err => {
                this.setState({ error: err.message });
                toolbox.loading(false);
            });
    }

    getAvailableUsers(value, group) {
        const { toolbox } = this.props;
        toolbox.loading(true);

        const actions = new Actions(toolbox);
        actions
            .doGetUsers()
            .then(users => {
                this.setState({ error: null, group, users, modalType: value, showModal: true });
                toolbox.loading(false);
            })
            .catch(err => {
                this.setState({ error: err.message });
                toolbox.loading(false);
            });
    }

    showModal(value, group) {
        const { data, toolbox } = this.props;
        const actions = new Actions(toolbox);

        if (value === MenuAction.EDIT_TENANTS_ACTION) {
            this.getAvailableTenants(value, group);
        } else if (value === MenuAction.EDIT_USERS_ACTION) {
            this.getAvailableUsers(value, group);
        } else if (
            value === MenuAction.DELETE_ACTION ||
            (value === MenuAction.SET_DEFAULT_GROUP_ROLE_ACTION &&
                actions.isLogoutToBePerformed(group, data.items, group.users))
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
        const { group } = this.state;
        const { data, toolbox } = this.props;
        toolbox.loading(true);

        const actions = new Actions(toolbox);
        actions
            .doDelete(group.name)
            .then(() => {
                if (actions.isLogoutToBePerformed(group, data.items, group.users)) {
                    toolbox.getEventBus().trigger('menu.users:logout');
                } else {
                    this.hideModal({ error: null });
                    toolbox.loading(false);
                    toolbox.refresh();
                    toolbox.getEventBus().trigger('users:refresh');
                    toolbox.getEventBus().trigger('tenants:refresh');
                }
            })
            .catch(err => {
                this.hideModal({ error: err.message });
                toolbox.loading(false);
            });
    }

    setRole(group, changeToAdmin) {
        const { modalType, showModal } = this.state;
        const { toolbox } = this.props;
        toolbox.loading(true);
        this.setState({ settingGroupRoleLoading: group.name });

        const actions = new Actions(toolbox);
        actions
            .doSetRole(
                group.name,
                changeToAdmin ? Stage.Common.Consts.sysAdminRole : Stage.Common.Consts.defaultUserRole
            )
            .then(() => {
                this.setState({ error: null, settingGroupRoleLoading: false });
                toolbox.loading(false);
                if (modalType === MenuAction.SET_DEFAULT_GROUP_ROLE_ACTION && showModal) {
                    toolbox.getEventBus().trigger('menu.users:logout');
                } else {
                    toolbox.refresh();
                    toolbox.getEventBus().trigger('users:refresh');
                }
            })
            .catch(err => {
                this.setState({ error: err.message, settingGroupRoleLoading: false });
                toolbox.loading(false);
            });
    }

    render() {
        const { error, group, modalType, settingGroupRoleLoading, showModal, tenants, users } = this.state;
        const { data, toolbox, widget } = this.props;
        const NO_DATA_MESSAGE = 'There are no User Groups available. Click "Add" to add User Groups.';
        const { Checkbox, Confirm, DataTable, ErrorMessage, Label, Loader } = Stage.Basic;

        return (
            <div>
                <ErrorMessage error={error} onDismiss={() => this.setState({ error: null })} autoHide />

                <DataTable
                    fetchData={this.fetchData.bind(this)}
                    totalSize={data.total}
                    pageSize={widget.configuration.pageSize}
                    sortColumn={widget.configuration.sortColumn}
                    sortAscending={widget.configuration.sortAscending}
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
                    {data.items.map(item => {
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
                                        {settingGroupRoleLoading === item.name ? (
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
                                        groups={data.items}
                                        toolbox={toolbox}
                                        onError={this.handleError.bind(this)}
                                    />
                                </DataTable.DataExpandable>
                            </DataTable.RowExpandable>
                        );
                    })}
                    <DataTable.Action>
                        <CreateModal toolbox={toolbox} />
                    </DataTable.Action>
                </DataTable>

                <UsersModal
                    open={modalType === MenuAction.EDIT_USERS_ACTION && showModal}
                    group={group}
                    groups={data.items}
                    users={users}
                    onHide={this.hideModal.bind(this)}
                    toolbox={toolbox}
                />

                <TenantsModal
                    open={modalType === MenuAction.EDIT_TENANTS_ACTION && showModal}
                    group={group}
                    tenants={tenants}
                    onHide={this.hideModal.bind(this)}
                    toolbox={toolbox}
                />

                <Confirm
                    content={`Are you sure you want to remove group ${group.name}?`}
                    open={modalType === MenuAction.DELETE_ACTION && showModal}
                    onConfirm={this.deleteUserGroup.bind(this)}
                    onCancel={this.hideModal.bind(this)}
                />

                <Confirm
                    content={
                        `You have administrator privileges from the '${group.name}' group. ` +
                        'Are you sure you want to remove administrator privileges from this group? ' +
                        'You will be logged out of the system so the changes take effect.'
                    }
                    open={modalType === MenuAction.SET_DEFAULT_GROUP_ROLE_ACTION && showModal}
                    onConfirm={this.setRole.bind(this, group, false)}
                    onCancel={this.hideModal.bind(this)}
                />
            </div>
        );
    }
}

UserGroupsTable.propTypes = {
    data: PropTypes.shape({
        items: PropTypes.arrayOf(GroupPropType),
        total: PropTypes.number.isRequired
    }).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    widget: Stage.PropTypes.Widget.isRequired
};
