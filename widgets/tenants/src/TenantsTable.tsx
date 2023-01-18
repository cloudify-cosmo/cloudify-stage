import type { Toolbox } from 'app/utils/StageAPI';
import type { DataTableProps } from 'cloudify-ui-components/typings/components/data/DataTable/DataTable';
import type { Tenant, TenantsWidget } from './widget.types';
import Actions from './actions';
import CreateModal from './CreateModal';
import GroupsModal from './GroupsModal';
import MenuAction from './MenuAction';
import TenantDetails from './TenantDetails';
import UsersModal from './UsersModal';

const t = Stage.Utils.getT(`widgets.tenants.tenantsTable`);

interface TenantsTableProps {
    data: {
        items: Tenant[];
        total: number;
    };
    toolbox: Toolbox;
    widget: TenantsWidget;
}

interface TenantsTableState {
    error: any;
    showModal?: boolean;
    modalType?: string;
    tenant: Tenant;
    userGroups?: string[];
    users?: string[];
}

type TenantActionHandler = (action: string, tenant: Tenant) => void;

export default class TenantsTable extends React.Component<TenantsTableProps, TenantsTableState> {
    constructor(props: TenantsTableProps) {
        super(props);
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('tenants:refresh', this.refreshData, this);
    }

    shouldComponentUpdate(nextProps: TenantsTableProps, nextState: TenantsTableState) {
        const { data, widget } = this.props;
        return (
            !_.isEqual(widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(data, nextProps.data)
        );
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().off('tenants:refresh', this.refreshData);
    }

    getAvailableUsers: TenantActionHandler = (value, tenant) => {
        const { toolbox } = this.props;
        toolbox.loading(true);

        const actions = new Actions(toolbox);
        actions
            .doGetUsers()
            .then(users => {
                this.setState({
                    error: null,
                    tenant,
                    users: users.items.map(user => user.username),
                    modalType: value,
                    showModal: true
                });
                toolbox.loading(false);
            })
            .catch(err => {
                this.setState({ error: err.message });
                toolbox.loading(false);
            });
    };

    getAvailableUserGroups: TenantActionHandler = (value, tenant) => {
        const { toolbox } = this.props;
        toolbox.loading(true);

        const actions = new Actions(toolbox);
        actions
            .doGetUserGroups()
            .then(userGroups => {
                this.setState({
                    error: null,
                    tenant,
                    userGroups: userGroups.items.map(userGroup => userGroup.name),
                    modalType: value,
                    showModal: true
                });
                toolbox.loading(false);
            })
            .catch(err => {
                this.setState({ error: err.message });
                toolbox.loading(false);
            });
    };

    fetchGridData: DataTableProps['fetchData'] = fetchParams => {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };

    selectAction: TenantActionHandler = (value, tenant) => {
        if (value === MenuAction.EDIT_USERS_ACTION) {
            this.getAvailableUsers(value, tenant);
        } else if (value === MenuAction.EDIT_USER_GROUPS_ACTION) {
            this.getAvailableUserGroups(value, tenant);
        } else if (value === MenuAction.DELETE_TENANT_ACTION) {
            this.setState({ tenant, modalType: value, showModal: true });
        } else {
            this.setState({ error: t('errors.unknownAction', { actionName: value }) });
        }
    };

    deleteTenant = () => {
        const { toolbox } = this.props;
        const { tenant } = this.state;
        const actions = new Actions(toolbox);
        const HIDE_DELETE_MODAL_STATE = { modalType: MenuAction.DELETE_TENANT_ACTION, showModal: false };

        actions
            .doDelete(tenant.name)
            .then((/* tenant */) => {
                this.setState({ ...HIDE_DELETE_MODAL_STATE, error: null });
                toolbox.getEventBus().trigger('tenants:refresh');
            })
            .catch(err => {
                this.setState({ ...HIDE_DELETE_MODAL_STATE, error: err.message });
            });
    };

    hideModal = () => {
        this.setState({ showModal: false });
    };

    refreshData() {
        const { toolbox } = this.props;
        this.setState({ error: null });
        toolbox.refresh();
    }

    selectTenant(tenantName: string) {
        const { toolbox } = this.props;
        const selectedTenantName = toolbox.getContext().getValue('tenantName');
        toolbox.getContext().setValue('tenantName', tenantName === selectedTenantName ? null : tenantName);
    }

    render() {
        const { data, toolbox, widget } = this.props;
        const { error, modalType, showModal, tenant, userGroups, users } = this.state;
        const { ErrorMessage, DataTable, Label } = Stage.Basic;
        const DeleteModal = Stage.Basic.Confirm;

        return (
            <div>
                <ErrorMessage error={error} onDismiss={() => this.setState({ error: null })} autoHide />

                <DataTable
                    fetchData={this.fetchGridData}
                    totalSize={data.total}
                    pageSize={widget.configuration.pageSize}
                    sortColumn={widget.configuration.sortColumn}
                    sortAscending={widget.configuration.sortAscending}
                    searchable
                    className="tenantsTable"
                    noDataMessage={t('noDataMessage')}
                >
                    <DataTable.Column label={t('columns.name')} name="name" width="30%" />
                    <DataTable.Column label={t('columns.groups')} width="30%" />
                    <DataTable.Column label={t('columns.users')} width="30%" />
                    <DataTable.Column width="10%" />

                    {data.items.map(item => {
                        const selected = toolbox.getContext().getValue('tenantName') === item.name;
                        return (
                            <DataTable.RowExpandable key={item.name} expanded={selected}>
                                <DataTable.Row
                                    key={item.name}
                                    selected={selected}
                                    onClick={() => this.selectTenant(item.name)}
                                >
                                    <DataTable.Data>{item.name}</DataTable.Data>
                                    <DataTable.Data>
                                        <Label className="green" horizontal>
                                            {Object.keys(item.groups).length}
                                        </Label>
                                    </DataTable.Data>
                                    <DataTable.Data>
                                        <Label className="blue" horizontal>
                                            {Object.keys(item.users).length}
                                        </Label>
                                    </DataTable.Data>
                                    <DataTable.Data textAlign="center" className="rowActions">
                                        <MenuAction tenant={item} onSelectAction={this.selectAction} />
                                    </DataTable.Data>
                                </DataTable.Row>

                                <DataTable.DataExpandable key={item.name}>
                                    <TenantDetails
                                        tenant={item}
                                        toolbox={toolbox}
                                        onError={err => this.setState({ error: err })}
                                    />
                                </DataTable.DataExpandable>
                            </DataTable.RowExpandable>
                        );
                    })}

                    <DataTable.Action>
                        <CreateModal toolbox={toolbox} />
                    </DataTable.Action>
                </DataTable>

                <DeleteModal
                    content={t('deleteModal.content', {
                        tenantName: tenant.name
                    })}
                    open={modalType === MenuAction.DELETE_TENANT_ACTION && showModal}
                    onConfirm={this.deleteTenant}
                    onCancel={this.hideModal}
                />

                <UsersModal
                    toolbox={toolbox}
                    open={modalType === MenuAction.EDIT_USERS_ACTION && showModal}
                    onHide={this.hideModal}
                    tenant={tenant}
                    users={users}
                />

                <GroupsModal
                    toolbox={toolbox}
                    open={modalType === MenuAction.EDIT_USER_GROUPS_ACTION && showModal}
                    onHide={this.hideModal}
                    tenant={tenant}
                    userGroups={userGroups}
                />
            </div>
        );
    }
}
