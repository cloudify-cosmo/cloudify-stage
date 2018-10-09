/**
 * Created by pposel on 30/01/2017.
 */
import Actions from './actions';
import MenuAction from './MenuAction';
import UserDetails from './UserDetails';
import CreateModal from './CreateModal';
import PasswordModal from './PasswordModal';
import TenantModal from './TenantModal';
import GroupModal from './GroupModal';

export default class UsersTable extends React.Component {
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
        }
    }

    static EMPTY_USER = {username: ''};

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.widget, nextProps.widget)
            || !_.isEqual(this.state, nextState)
            || !_.isEqual(this.props.data, nextProps.data);
    }

    _refreshData() {
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('users:refresh', this._refreshData, this);
        this._getAvailableTenants(null, null, false);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('users:refresh', this._refreshData);
    }

    fetchData(fetchParams) {
        return this.props.toolbox.refresh(fetchParams);
    }

    _selectUser(userName) {
        let selectedUserName = this.props.toolbox.getContext().getValue('userName');
        this.props.toolbox.getContext().setValue('userName', userName === selectedUserName ? null : userName);
    }

    _getAvailableTenants(value, user, showModal=true) {
        this.props.toolbox.loading(true);

        let actions = new Actions(this.props.toolbox);
        actions.doGetTenants().then((tenants)=>{
            this.setState({
                error: null, tenants,
                user: showModal ? user : UsersTable.EMPTY_USER,
                modalType: showModal ? value : '', showModal
            });
            this.props.toolbox.loading(false);
        }).catch((err)=> {
            this.setState({error: err.message});
            this.props.toolbox.loading(false);
        });
    }

    _getAvailableGroups(value, user) {
        this.props.toolbox.loading(true);

        let actions = new Actions(this.props.toolbox);
        actions.doGetGroups().then((groups)=>{
            this.setState({error: null, user, groups, modalType: value, showModal: true});
            this.props.toolbox.loading(false);
        }).catch((err)=> {
            this.setState({error: err.message});
            this.props.toolbox.loading(false);
        });
    }

    _showModal(value, user) {
        if (value === MenuAction.EDIT_TENANTS_ACTION) {
            this._getAvailableTenants(value, user);
        } else if (value === MenuAction.EDIT_GROUPS_ACTION) {
            this._getAvailableGroups(value, user);
        } else if (value === MenuAction.ACTIVATE_ACTION) {
            this._activateUser(user);
        } else if (value === MenuAction.DEACTIVATE_ACTION && !this._isCurrentUser(user)) {
             this._deactivateUser(user);
        } else if (value === MenuAction.SET_ADMIN_USER_ROLE_ACTION) {
            this._setRole(user, true);
        } else if (value === MenuAction.SET_DEFAULT_USER_ROLE_ACTION && !this._isCurrentUser(user)) {
            this._setRole(user, false);
        } else {
            this.setState({user, modalType: value, showModal: true});
        }
    }

    _hideModal() {
        this.setState({showModal: false});
    }

    _handleError(message) {
        this.setState({error: message});
    }

    _isCurrentUser(user) {
        return this.props.toolbox.getManager().getCurrentUsername() === user.username;
    }

    _isUserInAdminGroup(user) {
        return _.has(user.group_system_roles, Stage.Common.Consts.sysAdminRole);
    }

    _deleteUser() {
        this.props.toolbox.loading(true);

        var actions = new Actions(this.props.toolbox);
        actions.doDelete(this.state.user.username).then(()=>{
            this._hideModal();
            this.setState({error: null});
            this.props.toolbox.loading(false);
            this.props.toolbox.refresh();
        }).catch((err)=>{
            this._hideModal();
            this.setState({error: err.message});
            this.props.toolbox.loading(false);
        });
    }

    _setRole(user, isAdmin) {
        this.props.toolbox.loading(true);
        this.setState({settingUserRoleLoading: user.username});

        var actions = new Actions(this.props.toolbox);
        actions.doSetRole(user.username, Stage.Common.RolesUtil.getSystemRole(isAdmin)).then(()=>{
            this.setState({error: null, settingUserRoleLoading: false});
            this.props.toolbox.loading(false);
            if (this._isCurrentUser(user) && !isAdmin) {
                this.props.toolbox.getEventBus().trigger('menu.users:logout');
            } else {
                this.props.toolbox.refresh();
            }
        }).catch((err)=>{
            this.setState({error: err.message, settingUserRoleLoading: false});
            this.props.toolbox.loading(false);
        });
    }

    _activateUser(user) {
        this.props.toolbox.loading(true);
        this.setState({activateLoading: user.username});

        var actions = new Actions(this.props.toolbox);
        actions.doActivate(user.username).then(()=>{
            this.setState({error: null, activateLoading: false});
            this.props.toolbox.loading(false);
            this.props.toolbox.refresh();
        }).catch((err)=>{
            this.setState({error: err.message, activateLoading: false});
            this.props.toolbox.loading(false);
        });

    }

    _deactivateUser(user) {
        this.props.toolbox.loading(true);
        this.setState({activateLoading: user.username});

        var actions = new Actions(this.props.toolbox);
        actions.doDeactivate(user.username).then(()=>{
            this.setState({error: null, activateLoading: false});
            this.props.toolbox.loading(false);
            if (this._isCurrentUser(user)) {
                this.props.toolbox.getEventBus().trigger('menu.users:logout');
            } else {
                this.props.toolbox.refresh();
                this.props.toolbox.getEventBus().trigger('userGroups:refresh');
            }
        }).catch((err)=>{
            this.setState({error: err.message, activateLoading: false});
            this.props.toolbox.loading(false);
        });
    }

    render() {
        const NO_DATA_MESSAGE = 'There are no Users available in manager. Click "Add" to add Users.';
        let {Checkbox, Confirm, DataTable, ErrorMessage, Label, Loader, Popup} = Stage.Basic;
        let tableName = 'usersTable';

        return (
            <div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({error: null})} autoHide={true}/>

                <DataTable fetchData={this.fetchData.bind(this)}
                           totalSize={this.props.data.total}
                           pageSize={this.props.widget.configuration.pageSize}
                           sortColumn={this.props.widget.configuration.sortColumn}
                           sortAscending={this.props.widget.configuration.sortAscending}
                           searchable={true}
                           className={tableName}
                           noDataMessage={NO_DATA_MESSAGE}>

                    <DataTable.Column label="Username" name="username" width="37%" />
                    <DataTable.Column label="Last login" name="last_login_at" width="18%" />
                    <DataTable.Column label="Admin" width="10%" />
                    <DataTable.Column label="Active" name="active" width="10%" />
                    <DataTable.Column label="# Groups" width="10%" />
                    <DataTable.Column label="# Tenants" width="10%" />
                    <DataTable.Column label="" width="5%" />
                    {
                        this.props.data.items.map((item) => {

                            const isAdminCheckbox = (item, disabled) =>
                                <Checkbox checked={item.isAdmin}
                                          disabled={disabled || item.username === Stage.Common.Consts.adminUsername}
                                          onChange={() =>
                                              item.isAdmin
                                                  ? this._showModal(MenuAction.SET_DEFAULT_USER_ROLE_ACTION, item)
                                                  : this._showModal(MenuAction.SET_ADMIN_USER_ROLE_ACTION, item)
                                          }
                                          onClick={(e)=>{e.stopPropagation();}}
                                />

                            return (
                                <DataTable.RowExpandable key={item.username} expanded={item.isSelected}>
                                    <DataTable.Row id={`${tableName}_${item.username}`} key={item.username} selected={item.isSelected} onClick={this._selectUser.bind(this, item.username)}>
                                        <DataTable.Data>{item.username}</DataTable.Data>
                                        <DataTable.Data>{item.last_login_at}</DataTable.Data>
                                        <DataTable.Data className="center aligned">
                                            {this.state.settingUserRoleLoading === item.username
                                                ? <Loader active inline size='mini'/>
                                                : this._isUserInAdminGroup(item) && item.username !== Stage.Common.Consts.adminUsername
                                                    ? <Popup>
                                                        <Popup.Trigger>{isAdminCheckbox(item, true)}</Popup.Trigger>
                                                        <Popup.Content>
                                                            To remove the administrator privileges for this user,
                                                            remove the user from the group that is assigned administrator privileges.
                                                        </Popup.Content>
                                                    </Popup>
                                                    : isAdminCheckbox(item, false)
                                            }
                                        </DataTable.Data>
                                        <DataTable.Data className="center aligned">
                                        {this.state.activateLoading === item.username ? 
                                            <Loader active inline size='mini' /> :
                                            <Checkbox 
                                                checked={item.active}
                                                onChange={() => 
                                                    item.active 
                                                    ? this._showModal(MenuAction.DEACTIVATE_ACTION, item) 
                                                    : this._showModal(MenuAction.ACTIVATE_ACTION, item) 
                                                }
                                                onClick={(e)=>{e.stopPropagation();}}
                                            />}
                                        </DataTable.Data>
                                        <DataTable.Data><Label className="green" horizontal>{item.groupCount}</Label></DataTable.Data>
                                        <DataTable.Data><Label className="blue" horizontal>{item.tenantCount}</Label></DataTable.Data>
                                        <DataTable.Data className="center aligned">
                                            <MenuAction item={item} onSelectAction={this._showModal.bind(this)}/>
                                        </DataTable.Data>
                                    </DataTable.Row>
                                    <DataTable.DataExpandable key={item.username}>
                                        <UserDetails data={item} toolbox={this.props.toolbox} onError={this._handleError.bind(this)}/>
                                    </DataTable.DataExpandable>
                                </DataTable.RowExpandable>
                            );
                        })
                    }
                    <DataTable.Action>
                        <CreateModal roles={this.props.roles} tenants={this.state.tenants} toolbox={this.props.toolbox}/>
                    </DataTable.Action>
                </DataTable>

                <PasswordModal
                    open={this.state.modalType === MenuAction.SET_PASSWORD_ACTION && this.state.showModal}
                    user={this.state.user}
                    onHide={this._hideModal.bind(this)}
                    toolbox={this.props.toolbox}/>

                <TenantModal
                    open={this.state.modalType === MenuAction.EDIT_TENANTS_ACTION && this.state.showModal}
                    user={this.state.user}
                    tenants={this.state.tenants}
                    onHide={this._hideModal.bind(this)}
                    toolbox={this.props.toolbox}/>

                <GroupModal
                    open={this.state.modalType === MenuAction.EDIT_GROUPS_ACTION && this.state.showModal}
                    user={this.state.user}
                    groups={this.state.groups}
                    onHide={this._hideModal.bind(this)}
                    toolbox={this.props.toolbox}/>

                <Confirm content={`Are you sure you want to remove user ${this.state.user.username}?`}
                         open={this.state.modalType === MenuAction.DELETE_ACTION && this.state.showModal}
                         onConfirm={this._deleteUser.bind(this)}
                         onCancel={this._hideModal.bind(this)} />

                <Confirm content={'Are you sure you want to remove your administrator privileges? ' +
                                  'You will be logged out of the system so the changes take effect.'}
                         open={this.state.modalType === MenuAction.SET_DEFAULT_USER_ROLE_ACTION && this.state.showModal}
                         onConfirm={this._setRole.bind(this, this.state.user, false)}
                         onCancel={this._hideModal.bind(this)} />

                <Confirm content='Are you sure you want to deactivate current user and log out?'
                         open={this.state.modalType === MenuAction.DEACTIVATE_ACTION && this.state.showModal}
                         onConfirm={this._deactivateUser.bind(this, this.state.user)}
                         onCancel={this._hideModal.bind(this)} />

            </div>
        );
    }
}
