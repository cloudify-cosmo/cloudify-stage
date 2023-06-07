import type { FetchParams } from 'app/widgets/common/types';
import type { NamedResourceResponse } from './actions';
import Actions from './actions';
import CreateModal from './CreateModal';
import GroupModal from './GroupModal';
import ActionsMenu, { MenuAction } from './ActionsMenu';

import TenantModal from './TenantModal';
import UserDetails from './UserDetails';
import type { UserViewItem } from './widget';
import IsAdminCheckbox from './IsAdminCheckbox';
import type { User, UserManagementWidget } from './widget.types';
import getWidgetT from './getWidgetT';
import InviteModal from './InviteModal';
import AuthServiceActions from './authServiceActions';

const translate = getWidgetT();
const tColumn = (key: string) => translate(`columns.${key}`);

interface UsersTableProps {
    data: { items: UserViewItem[]; total: number };
    toolbox: Stage.Types.Toolbox;
    widget: Stage.Types.Widget<UserManagementWidget.Configuration>;
}

interface UsersTableState {
    error: string | null;
    showModal: boolean;
    modalType: MenuAction | null;
    user: User | null;
    tenants: string[];
    groups: string[];
    usernameDuringActivation: string;
    usernameDuringRoleSetting: string;
    isAuthServiceAvailable: boolean | null;
}

function getNames(response: NamedResourceResponse) {
    return response.items.map(item => item.name);
}

export default class UsersTable extends React.Component<UsersTableProps, UsersTableState> {
    constructor(props: UsersTableProps) {
        super(props);

        this.state = {
            error: null,
            showModal: false,
            modalType: null,
            user: null,
            tenants: [],
            groups: [],
            usernameDuringActivation: '',
            usernameDuringRoleSetting: '',
            isAuthServiceAvailable: null
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        const authServiceActions = new AuthServiceActions(toolbox);
        authServiceActions.isAuthServiceAvailable().then(isAuthServiceAvailable => {
            this.setState({ isAuthServiceAvailable });
        });
        toolbox.getEventBus().on('users:refresh', this.refreshData, this);
    }

    shouldComponentUpdate(nextProps: UsersTableProps, nextState: UsersTableState) {
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

    getAvailableTenants(value: MenuAction, user: User, showModal = true) {
        const { toolbox } = this.props;
        toolbox.loading(true);

        const actions = new Actions(toolbox);
        actions
            .doGetTenants()
            .then(tenants => {
                this.setState({
                    error: null,
                    tenants: getNames(tenants),
                    user: showModal ? user : null,
                    modalType: showModal ? value : null,
                    showModal
                });
                toolbox.loading(false);
            })
            .catch(err => {
                this.setState({ error: err.message });
                toolbox.loading(false);
            });
    }

    getAvailableGroups(value: any, user: any) {
        const { toolbox } = this.props;
        toolbox.loading(true);

        const actions = new Actions(toolbox);
        actions
            .doGetGroups()
            .then(groups => {
                this.setState({ error: null, user, groups: getNames(groups), modalType: value, showModal: true });
                toolbox.loading(false);
            })
            .catch(err => {
                this.setState({ error: err.message });
                toolbox.loading(false);
            });
    }

    setRole(user: User, isAdmin: boolean) {
        const { toolbox } = this.props;
        toolbox.loading(true);
        this.setState({ usernameDuringRoleSetting: user.username });

        const actions = new Actions(toolbox);
        actions
            .doSetRole(user.username, Stage.Common.Roles.Utils.getSystemRole(isAdmin))
            .then(() => {
                this.setState({ error: null, usernameDuringRoleSetting: '' });
                toolbox.loading(false);
                if (this.isCurrentUser(user) && !isAdmin) {
                    toolbox.getEventBus().trigger('menu.users:logout');
                } else {
                    toolbox.refresh();
                }
            })
            .catch(err => {
                this.setState({ error: err.message, usernameDuringRoleSetting: '' });
                toolbox.loading(false);
            });
    }

    setGettingStartedModalEnabled(user: User, modalEnabled: boolean) {
        const { toolbox } = this.props;
        toolbox.loading(true);

        const actions = new Actions(toolbox);
        actions
            .doSetGettingStartedModalEnabled(user.username, modalEnabled)
            .then(() => {
                toolbox.loading(false);
                toolbox.refresh();
            })
            .catch(err => {
                this.setState({ error: err.message });
                toolbox.loading(false);
            });
    }

    fetchData = (fetchParams: FetchParams) => {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };

    invokeAction = (action: MenuAction, user: User) => {
        if (action === MenuAction.EDIT_TENANTS_ACTION) {
            this.getAvailableTenants(action, user);
        } else if (action === MenuAction.EDIT_GROUPS_ACTION) {
            this.getAvailableGroups(action, user);
        } else if (action === MenuAction.ACTIVATE_ACTION) {
            this.activateUser(user);
        } else if (action === MenuAction.DEACTIVATE_ACTION && !this.isCurrentUser(user)) {
            this.deactivateUser(user);
        } else if (action === MenuAction.SET_ADMIN_USER_ROLE_ACTION) {
            this.setRole(user, true);
        } else if (action === MenuAction.SET_DEFAULT_USER_ROLE_ACTION && !this.isCurrentUser(user)) {
            this.setRole(user, false);
        } else if (action === MenuAction.ENABLE_GETTING_STARTED_MODAL_ACTION) {
            this.setGettingStartedModalEnabled(user, true);
        } else if (action === MenuAction.DISABLE_GETTING_STARTED_MODAL_ACTION) {
            this.setGettingStartedModalEnabled(user, false);
        } else {
            this.setState({ user, modalType: action, showModal: true });
        }
    };

    hideModal = () => {
        this.setState({ showModal: false });
    };

    handleError = (message: string) => {
        this.setState({ error: message });
    };

    deleteUser = () => {
        const { toolbox } = this.props;
        const { user } = this.state;
        toolbox.loading(true);

        const actions = new Actions(toolbox);
        actions
            .doDelete(user!.username)
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

    selectUser(userName: string) {
        const { toolbox } = this.props;
        const selectedUserName = toolbox.getContext().getValue('userName');
        toolbox.getContext().setValue('userName', userName === selectedUserName ? null : userName);
    }

    deactivateUser(user: User) {
        const { toolbox } = this.props;
        toolbox.loading(true);
        this.setState({ usernameDuringActivation: user.username });

        const actions = new Actions(toolbox);
        actions
            .doDeactivate(user.username)
            .then(() => {
                this.setState({ error: null, usernameDuringActivation: '' });
                toolbox.loading(false);
                if (this.isCurrentUser(user)) {
                    toolbox.getEventBus().trigger('menu.users:logout');
                } else {
                    toolbox.refresh();
                    toolbox.getEventBus().trigger('userGroups:refresh');
                }
            })
            .catch(err => {
                this.setState({ error: err.message, usernameDuringActivation: '' });
                toolbox.loading(false);
            });
    }

    refreshData() {
        const { toolbox } = this.props;
        toolbox.refresh();
    }

    isCurrentUser(user: User) {
        const { toolbox } = this.props;
        return toolbox.getManager().getCurrentUsername() === user.username;
    }

    hasAdminRole() {
        const { toolbox } = this.props;
        return toolbox.getManager().getCurrentUserRole() === Stage.Common.Consts.sysAdminRole;
    }

    activateUser(user: User) {
        const { toolbox } = this.props;
        toolbox.loading(true);
        this.setState({ usernameDuringActivation: user.username });

        const actions = new Actions(toolbox);
        actions
            .doActivate(user.username)
            .then(() => {
                this.setState({ error: null, usernameDuringActivation: '' });
                toolbox.loading(false);
                toolbox.refresh();
            })
            .catch(err => {
                this.setState({ error: err.message, usernameDuringActivation: '' });
                toolbox.loading(false);
            });
    }

    render() {
        const {
            error,
            groups,
            modalType,
            showModal,
            tenants,
            user,
            usernameDuringActivation,
            usernameDuringRoleSetting,
            isAuthServiceAvailable
        } = this.state;
        const { data, toolbox, widget } = this.props;
        const { Checkbox, Confirm, DataTable, ErrorMessage, Label, Loader } = Stage.Basic;
        const { PasswordModal, TextEllipsis } = Stage.Shared;
        const tableName = 'usersTable';

        if (isAuthServiceAvailable === null) return <Stage.Basic.Loading />;

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
                    noDataMessage={translate('noUsers')}
                >
                    <DataTable.Column label={tColumn('username')} name="username" width="37%" />
                    <DataTable.Column label={tColumn('lastLoginAt')} name="last_login_at" width="18%" />
                    <DataTable.Column label={tColumn('isAdmin')} width="10%" />
                    <DataTable.Column label={tColumn('active')} name="active" width="10%" />
                    <DataTable.Column
                        label={tColumn('showGettingStarted')}
                        name="show_getting_started"
                        style={{ whiteSpace: 'normal' }}
                        width="10%"
                    />
                    <DataTable.Column label={tColumn('groupCount')} width="10%" />
                    <DataTable.Column label={tColumn('tenantCount')} width="10%" />
                    <DataTable.Column label="" width="5%" />
                    {data.items.map(item => (
                        <DataTable.RowExpandable key={item.username} expanded={item.isSelected}>
                            <DataTable.Row
                                id={`${tableName}_${item.username}`}
                                key={item.username}
                                selected={item.isSelected}
                                onClick={() => this.selectUser(item.username)}
                            >
                                <DataTable.Data>
                                    <TextEllipsis maxWidth="450px">{item.username}</TextEllipsis>
                                </DataTable.Data>
                                <DataTable.Data>{item.last_login_at}</DataTable.Data>
                                <DataTable.Data>
                                    <IsAdminCheckbox
                                        onAdminUserChange={() =>
                                            this.invokeAction(MenuAction.SET_ADMIN_USER_ROLE_ACTION, item)
                                        }
                                        onDefaultUserChange={() =>
                                            this.invokeAction(MenuAction.SET_DEFAULT_USER_ROLE_ACTION, item)
                                        }
                                        user={item}
                                        usernameDuringRoleSetting={usernameDuringRoleSetting}
                                    />
                                </DataTable.Data>
                                <DataTable.Data>
                                    {/* TODO (RD-2100): create better way to block current user state change */}
                                    {usernameDuringActivation === item.username ? (
                                        <Loader active inline size="mini" />
                                    ) : (
                                        <Checkbox
                                            checked={item.active}
                                            onChange={() =>
                                                item.active
                                                    ? this.invokeAction(MenuAction.DEACTIVATE_ACTION, item)
                                                    : this.invokeAction(MenuAction.ACTIVATE_ACTION, item)
                                            }
                                            // stop propagation call required to prevent row expanding/collapsing on click to checkbox
                                            onClick={e => e.stopPropagation()}
                                        />
                                    )}
                                </DataTable.Data>
                                <DataTable.Data>
                                    {/* TODO (RD-2100): propose way to block current user state change */}
                                    <Checkbox
                                        checked={item.show_getting_started}
                                        disabled={!this.hasAdminRole()}
                                        onChange={() =>
                                            item.show_getting_started
                                                ? this.invokeAction(
                                                      MenuAction.DISABLE_GETTING_STARTED_MODAL_ACTION,
                                                      item
                                                  )
                                                : this.invokeAction(
                                                      MenuAction.ENABLE_GETTING_STARTED_MODAL_ACTION,
                                                      item
                                                  )
                                        }
                                        // stop propagation call required to prevent row expanding/collapsing on click to checkbox
                                        onClick={e => e.stopPropagation()}
                                    />
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
                                <DataTable.Data textAlign="center">
                                    <ActionsMenu item={item} onSelectAction={this.invokeAction} />
                                </DataTable.Data>
                            </DataTable.Row>
                            <DataTable.DataExpandable key={item.username}>
                                <UserDetails data={item} toolbox={toolbox} onError={this.handleError} />
                            </DataTable.DataExpandable>
                        </DataTable.RowExpandable>
                    ))}
                    <DataTable.Action>
                        {isAuthServiceAvailable ? <InviteModal toolbox={toolbox} /> : <CreateModal toolbox={toolbox} />}
                    </DataTable.Action>
                </DataTable>

                {user && (
                    <>
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
                            content={translate('deleteConfirm', { username: user.username })}
                            open={modalType === MenuAction.DELETE_ACTION && showModal}
                            onConfirm={this.deleteUser}
                            onCancel={this.hideModal}
                        />

                        <Confirm
                            content={translate('removeAdminPrivilagesConfirm')}
                            open={modalType === MenuAction.SET_DEFAULT_USER_ROLE_ACTION && showModal}
                            onConfirm={() => this.setRole(user, false)}
                            onCancel={this.hideModal}
                        />

                        <Confirm
                            content={translate('deactivateConfirm')}
                            open={modalType === MenuAction.DEACTIVATE_ACTION && showModal}
                            onConfirm={() => this.deactivateUser(user)}
                            onCancel={this.hideModal}
                        />
                    </>
                )}
            </div>
        );
    }
}
