// @ts-nocheck File not migrated fully to TS

import Actions from './actions';
import CreateModal from './CreateModal';
import GroupsModal from './GroupsModal';
import MenuAction from './MenuAction';
import TenantDetails from './TenantDetails';
import UsersModal from './UsersModal';
import TenantPropType from './props/TenantPropType';

const t = Stage.Utils.getT(`widgets.tenants.tenantsTable`);

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
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('tenants:refresh', this.refreshData, this);
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
        toolbox.getEventBus().off('tenants:refresh', this.refreshData);
    }

    getAvailableUsers(value, tenant) {
        const { toolbox } = this.props;
        toolbox.loading(true);

        const actions = new Actions(toolbox);
        actions
            .doGetUsers()
            .then(users => {
                this.setState({ error: null, tenant, users, modalType: value, showModal: true });
                toolbox.loading(false);
            })
            .catch(err => {
                this.setState({ error: err.message });
                toolbox.loading(false);
            });
    }

    getAvailableUserGroups(value, tenant) {
        const { toolbox } = this.props;
        toolbox.loading(true);

        const actions = new Actions(toolbox);
        actions
            .doGetUserGroups()
            .then(userGroups => {
                this.setState({ error: null, tenant, userGroups, modalType: value, showModal: true });
                toolbox.loading(false);
            })
            .catch(err => {
                this.setState({ error: err.message });
                toolbox.loading(false);
            });
    }

    fetchGridData = fetchParams => {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };

    selectAction = (value, tenant) => {
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

    selectTenant(tenantName) {
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
                        return (
                            <DataTable.RowExpandable key={item.name} expanded={item.isSelected}>
                                <DataTable.Row
                                    key={item.name}
                                    selected={item.isSelected}
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
                                    <DataTable.Data className="center aligned rowActions">
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
                        <CreateModal widget={widget} data={data} toolbox={toolbox} />
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
                    widget={widget}
                    toolbox={toolbox}
                    open={modalType === MenuAction.EDIT_USERS_ACTION && showModal}
                    onHide={this.hideModal}
                    tenant={tenant}
                    users={users}
                />

                <GroupsModal
                    widget={widget}
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

TenantsTable.propTypes = {
    data: PropTypes.shape({ items: PropTypes.arrayOf(TenantPropType), total: PropTypes.number }).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    widget: Stage.PropTypes.Widget.isRequired
};
