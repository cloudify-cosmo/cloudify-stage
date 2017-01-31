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
            showUsersModal: false,
            showGroupsModal: false,
            showDeleteModal: false,
            tenant: {}
        }
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

        actions.doDelete(tenantName).then((tenant)=>{
            this.setState({showDeleteModal: false, error: null});
            this.props.toolbox.getEventBus().trigger('tenants:refresh');
        }).catch((err)=> {
            this.setState({showDeleteModal: false, error: err.message});
        });
    }

    _selectAction(value, tenant) {
        if (value === MenuAction.EDIT_USERS_ACTION) {
            this.setState({showUsersModal: true, tenant});
        } else if (value === MenuAction.EDIT_USER_GROUPS_ACTION) {
            this.setState({showGroupsModal: true, tenant});
        } else if (value === MenuAction.DELETE_TENANT_ACTION) {
            this.setState({showDeleteModal: true, tenant});
        }
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
                           className="tenantsTable">

                    <DataTable.Column label="Name" name="name" width="30%" />
                    <DataTable.Column label="# Groups" name="groups" width="30%" />
                    <DataTable.Column label="# Users" name="users" width="30%" />
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


                <DeleteModal title={`Are you sure you want to delete '${this.state.tenant.name}' tenant?`}
                             show={this.state.showDeleteModal}
                             onConfirm={this._deleteTenant.bind(this)}
                             onCancel={()=>this.setState({showDeleteModal : false})} />

                <UsersModal show={this.state.showUsersModal} widget={this.props.widget}
                            onHide={()=>this.setState({showUsersModal: false})}
                            tenant={this.state.tenant} users={data.users} userGroups={data.userGroups}
                            toolbox={this.props.toolbox}/>

                <GroupsModal show={this.state.showGroupsModal} widget={this.props.widget}
                             onHide={()=>this.setState({showGroupsModal: false})}
                             tenant={this.state.tenant} users={data.users} userGroups={data.userGroups}
                             toolbox={this.props.toolbox}/>
            </div>
        );
    }
}
