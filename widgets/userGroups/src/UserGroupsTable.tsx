import { isEqual } from 'lodash';

import Actions from './actions';
import CreateModal from './CreateModal';
import GroupDetails from './GroupDetails';
import { menuActions } from './consts';
import TenantsModal from './TenantsModal';
import UsersModal from './UsersModal';
import type { Users } from './UsersModal';
import type { UserGroup, UserGroupManagmentWidget } from './widget.types';
import MenuAction from './MenuAction';
import type { ReduxState } from '../../../app/reducers';
import type { UserGroupData } from './widget';

const t = Stage.Utils.getT('widgets.userGroups');

interface UserGroupsTableProps {
    data: UserGroupData;
    toolbox: Stage.Types.Toolbox;
    widget: Stage.Types.Widget<UserGroupManagmentWidget.Configuration>;
    isLdapEnabled: boolean;
}
interface UserGroupsTableState {
    error: string | null;
    showModal: boolean;
    modalType: string;
    group: UserGroup | null;
    tenants: string[];
    users: Users;
    settingGroupRoleLoading: boolean | string;
}

class UserGroupsTable extends React.Component<UserGroupsTableProps, UserGroupsTableState> {
    constructor(props: UserGroupsTableProps, context: any) {
        super(props, context);

        this.state = {
            error: null,
            showModal: false,
            modalType: '',
            group: null,
            tenants: [],
            users: {},
            settingGroupRoleLoading: false
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('userGroups:refresh', this.refreshData, this);
    }

    shouldComponentUpdate(nextProps: UserGroupsTableProps, nextState: UserGroupsTableState) {
        const { data, widget } = this.props;
        return !isEqual(widget, nextProps.widget) || !isEqual(this.state, nextState) || !isEqual(data, nextProps.data);
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().off('userGroups:refresh', this.refreshData);
    }

    setRole(group: UserGroup, changeToAdmin: boolean) {
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
                if (modalType === menuActions.setDefaultGroupRole && showModal) {
                    toolbox.getEventBus().trigger('menu.users:logout');
                } else {
                    toolbox.refresh();
                    toolbox.getEventBus().trigger('users:refresh');
                }
            })
            .catch((err: { message: any }) => {
                this.setState({ error: err.message, settingGroupRoleLoading: false });
                toolbox.loading(false);
            });
    }

    getAvailableTenants(value: string, group: UserGroup) {
        const { toolbox } = this.props;
        toolbox.loading(true);

        const actions = new Actions(toolbox);
        actions
            .doGetTenants()
            .then(tenants => {
                this.setState({ error: null, group, tenants, modalType: value, showModal: true });
                toolbox.loading(false);
            })
            .catch((err: { message: string }) => {
                this.setState({ error: err.message });
                toolbox.loading(false);
            });
    }

    getAvailableUsers(value: string, group: UserGroup) {
        const { toolbox } = this.props;
        toolbox.loading(true);

        const actions = new Actions(toolbox);
        actions
            .doGetUsers()
            .then(users => {
                this.setState({ error: null, group, users, modalType: value, showModal: true });
                toolbox.loading(false);
            })
            .catch((err: { message: string }) => {
                this.setState({ error: err.message });
                toolbox.loading(false);
            });
    }

    fetchData = (fetchParams: { gridParams: Stage.Types.GridParams }) => {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };

    showModal = (value: string, group: UserGroup) => {
        const { data, toolbox } = this.props;
        const actions = new Actions(toolbox);

        if (
            value === menuActions.setDefaultGroupRole &&
            actions.isLogoutToBePerformed(group, data.items, group.users)
        ) {
            this.setState({ group, modalType: value, showModal: true });
        } else if (value === menuActions.setAdminGroupRole) {
            this.setRole(group, true);
        } else if (value === menuActions.setDefaultGroupRole) {
            this.setRole(group, false);
        } else {
            const errorMessage = t('exceptions.unknownAction', {
                actionName: value
            });
            this.setState({ error: errorMessage });
        }
    };

    showEditTenantsModal = (group: UserGroup) => {
        this.getAvailableTenants(menuActions.editTenants, group);
    };

    showEditUsersModal = (group: UserGroup) => {
        this.getAvailableUsers(menuActions.editUsers, group);
    };

    showDeleteModal = (group: UserGroup) => {
        this.setState({ group, modalType: menuActions.delete, showModal: true });
    };

    hideModal = () => {
        this.setState({ showModal: false });
    };

    handleError = (message: string) => {
        this.setState({ error: message });
    };

    deleteUserGroup = () => {
        const { group } = this.state;
        const { data, toolbox } = this.props;
        toolbox.loading(true);

        const actions = new Actions(toolbox);
        if (group) {
            actions
                .doDelete(group.name)
                .then(() => {
                    if (actions.isLogoutToBePerformed(group, data.items, group.users)) {
                        toolbox.getEventBus().trigger('menu.users:logout');
                    } else {
                        this.hideModal();
                        this.setState({ error: null });
                        toolbox.loading(false);
                        toolbox.refresh();
                        toolbox.getEventBus().trigger('users:refresh');
                        toolbox.getEventBus().trigger('tenants:refresh');
                    }
                })
                .catch((err: { message: string }) => {
                    this.hideModal();
                    this.setState({ error: err.message });
                    toolbox.loading(false);
                });
        }
    };

    refreshData() {
        const { toolbox } = this.props;
        toolbox.refresh();
    }

    selectUserGroup(userGroup: string) {
        const { toolbox } = this.props;
        const selectedUserGroup: string = toolbox.getContext().getValue('userGroup');
        toolbox.getContext().setValue('userGroup', userGroup === selectedUserGroup ? null : userGroup);
    }

    render() {
        const { error, group, modalType, settingGroupRoleLoading, showModal, tenants, users } = this.state;
        const { data, toolbox, widget, isLdapEnabled } = this.props;
        const { Checkbox, Confirm, DataTable, ErrorMessage, Label, Loader } = Stage.Basic;

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
                    className="userGroupsTable"
                    noDataMessage={t('noGroups')}
                >
                    <DataTable.Column label={t('columns.groupName')} name="name" width="35%" />
                    {isLdapEnabled && <DataTable.Column label={t('columns.ldapGroup')} name="ldap_dn" width="20%" />}
                    <DataTable.Column label={t('columns.admin')} width="10%" />
                    <DataTable.Column label={t('columns.users')} width="10%" />
                    <DataTable.Column label={t('columns.tenants')} width="10%" />
                    <DataTable.Column label="" width="5%" />
                    {data.items.map(item => {
                        return (
                            <DataTable.RowExpandable key={item.name} expanded={item.isSelected}>
                                <DataTable.Row
                                    key={item.name}
                                    selected={item.isSelected}
                                    onClick={() => this.selectUserGroup(item.name)}
                                >
                                    <DataTable.Data>{item.name}</DataTable.Data>
                                    {isLdapEnabled && <DataTable.Data>{item.ldap_dn}</DataTable.Data>}
                                    <DataTable.Data>
                                        {settingGroupRoleLoading === item.name ? (
                                            <Loader active inline size="mini" />
                                        ) : (
                                            <Checkbox
                                                checked={item.isAdmin}
                                                onChange={() =>
                                                    item.isAdmin
                                                        ? this.showModal(menuActions.setDefaultGroupRole, item)
                                                        : this.showModal(menuActions.setAdminGroupRole, item)
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
                                    <DataTable.Data textAlign="center">
                                        <MenuAction
                                            item={item}
                                            onEditTenants={this.showEditTenantsModal}
                                            onEditUsers={this.showEditUsersModal}
                                            onDelete={this.showDeleteModal}
                                        />
                                    </DataTable.Data>
                                </DataTable.Row>
                                <DataTable.DataExpandable key={item.name}>
                                    <GroupDetails
                                        data={item}
                                        groups={data.items}
                                        toolbox={toolbox}
                                        onError={this.handleError}
                                    />
                                </DataTable.DataExpandable>
                            </DataTable.RowExpandable>
                        );
                    })}
                    <DataTable.Action>
                        <CreateModal toolbox={toolbox} isLdapEnabled={isLdapEnabled} />
                    </DataTable.Action>
                </DataTable>
                {group && (
                    <>
                        <UsersModal
                            open={modalType === menuActions.editUsers && showModal}
                            group={group}
                            groups={data.items}
                            users={users}
                            onHide={this.hideModal}
                            toolbox={toolbox}
                        />

                        <TenantsModal
                            open={modalType === menuActions.editTenants && showModal}
                            group={group}
                            tenants={tenants}
                            onHide={this.hideModal}
                            toolbox={toolbox}
                        />

                        <Confirm
                            content={t('confirm.deleteGroup', { groupName: group.name })}
                            open={modalType === menuActions.delete && showModal}
                            onConfirm={this.deleteUserGroup}
                            onCancel={this.hideModal}
                        />

                        <Confirm
                            content={t('confirm.defaultGroup', { groupName: group.name })}
                            open={modalType === menuActions.setDefaultGroupRole && showModal}
                            onConfirm={() => this.setRole(group, false)}
                            onCancel={this.hideModal}
                        />
                    </>
                )}
            </div>
        );
    }
}

export default connectToStore(
    (state: ReduxState) => ({
        isLdapEnabled: Stage.Utils.Idp.isLdap(state.manager)
    }),
    {}
)(UserGroupsTable);
