/**
 * Created by kinneretzin on 30/01/2017.
 */

import CreateModal from './CreateModal';
import UsersModal from './UsersModal';
import GroupsModal from './GroupsModal';
import MenuAction from './MenuAction';
import Actions from './actions';
import TenantDetails from './TenantDetails';

export default class TenantsTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            error: null,
            showModal: false,
            modalType: '',
            tenant: {},
            users: {},
            userGroups: {}
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.widget !== nextProps.widget
            || this.state != nextState
            || !_.isEqual(this.props.data, nextProps.data);
    }

    _refreshData() {
        this.setState({error: null});
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('tenants:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('tenants:refresh', this._refreshData);
    }

    fetchGridData(fetchParams) {
        this.props.toolbox.refresh(fetchParams);
    }

    _selectTenant(tenantName) {
        let selectedTenantName = this.props.toolbox.getContext().getValue('tenantName');
        this.props.toolbox.getContext().setValue('tenantName', tenantName === selectedTenantName ? null : tenantName);
    }

    _deleteTenant() {
        let tenantName = this.state.tenant.name;
        let actions = new Actions(this.props.toolbox);
        const HIDE_DELETE_MODAL_STATE = {modalType: MenuAction.DELETE_TENANT_ACTION, showModal: false};

        actions.doDelete(tenantName).then((tenant)=>{
            this.setState({...HIDE_DELETE_MODAL_STATE, error: null});
            this.props.toolbox.getEventBus().trigger('tenants:refresh');
        }).catch((err)=> {
            this.setState({...HIDE_DELETE_MODAL_STATE, error: err.message});
        });
    }

    _getAvailableUsers(value, tenant) {
        this.props.toolbox.loading(true);

        let actions = new Actions(this.props.toolbox);
        actions.doGetUsers().then((users)=>{
            this.setState({tenant, users, modalType: value, showModal: true});
            this.props.toolbox.loading(false);
        }).catch((err)=> {
            this.setState({error: err.message});
            this.props.toolbox.loading(false);
        });
    }

    _getAvailableUserGroups(value, tenant) {
        this.props.toolbox.loading(true);

        let actions = new Actions(this.props.toolbox);
        actions.doGetUserGroups().then((userGroups)=>{
            this.setState({tenant, userGroups, modalType: value, showModal: true});
            this.props.toolbox.loading(false);
        }).catch((err)=> {
            this.setState({error: err.message});
            this.props.toolbox.loading(false);
        });
    }

    _selectAction(value, tenant) {
        if (value === MenuAction.EDIT_USERS_ACTION) {
            this._getAvailableUsers(value, tenant);
        } else if (value === MenuAction.EDIT_USER_GROUPS_ACTION) {
            this._getAvailableUserGroups(value, tenant);
        } else if (value === MenuAction.DELETE_TENANT_ACTION) {
            this.setState({tenant, modalType: value, showModal: true});
        } else {
            this.setState({error: `Internal error: Unknown action ('${value}') cannot be handled.`});
        }
    }

    _hideModal() {
        this.setState({showModal: false});
    }

    render() {
        let {ErrorMessage, DataTable, Label} = Stage.Basic;
        let DeleteModal = Stage.Basic.Confirm;
        let data = this.props.data;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <DataTable fetchData={this.fetchGridData.bind(this)}
                           totalSize={data.total}
                           pageSize={this.props.widget.configuration.pageSize}
                           sortColumn={this.props.widget.configuration.sortColumn}
                           sortAscending={this.props.widget.configuration.sortAscending}
                           className="tenantsTable">

                    <DataTable.Column label="Name" name="name" width="30%" />
                    <DataTable.Column label="# Groups" width="30%" />
                    <DataTable.Column label="# Users" width="30%" />
                    <DataTable.Column width="10%" />

                    {
                        data.items.map((tenant) => {
                            return (
                                <DataTable.RowExpandable key={tenant.name} expanded={tenant.isSelected}>
                                    <DataTable.Row key={tenant.name} selected={tenant.isSelected} onClick={this._selectTenant.bind(this, tenant.name)}>
                                        <DataTable.Data>{tenant.name}</DataTable.Data>
                                        <DataTable.Data><Label className="green" horizontal>{tenant.groups.length}</Label></DataTable.Data>
                                        <DataTable.Data><Label className="blue" horizontal>{tenant.users.length}</Label></DataTable.Data>
                                        <DataTable.Data className="center aligned rowActions">
                                            <MenuAction tenant={tenant} onSelectAction={this._selectAction.bind(this)} />
                                        </DataTable.Data>
                                    </DataTable.Row>

                                    <DataTable.DataExpandable>
                                        <TenantDetails tenant={tenant} toolbox={this.props.toolbox} onError={(err)=>this.setState({error: err})} />
                                    </DataTable.DataExpandable>
                                </DataTable.RowExpandable>
                            );
                        })
                    }

                    <DataTable.Action>
                        <CreateModal widget={this.props.widget} data={this.props.data} toolbox={this.props.toolbox}/>
                    </DataTable.Action>

                </DataTable>


                <DeleteModal content={`Are you sure you want to delete tenant '${this.state.tenant.name}'?`}
                             open={this.state.modalType === MenuAction.DELETE_TENANT_ACTION && this.state.showModal}
                             onConfirm={this._deleteTenant.bind(this)}
                             onCancel={this._hideModal.bind(this)}/>

                <UsersModal widget={this.props.widget} toolbox={this.props.toolbox}
                            open={this.state.modalType === MenuAction.EDIT_USERS_ACTION && this.state.showModal}
                            onHide={this._hideModal.bind(this)}
                            tenant={this.state.tenant} users={this.state.users}/>

                <GroupsModal widget={this.props.widget} toolbox={this.props.toolbox}
                             open={this.state.modalType === MenuAction.EDIT_USER_GROUPS_ACTION && this.state.showModal}
                             onHide={this._hideModal.bind(this)}
                             tenant={this.state.tenant} userGroups={this.state.userGroups}/>
            </div>
        );
    }
}
