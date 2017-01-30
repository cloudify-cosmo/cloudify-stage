/**
 * Created by kinneretzin on 30/01/2017.
 */

export default class TenantsTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
        }
    }

    _refreshData() {
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

    render() {
        let ErrorMessage = Stage.Basic.ErrorMessage;
        let DataTable = Stage.Basic.DataTable;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <DataTable fetchData={this.fetchGridData.bind(this)}
                       totalSize={this.props.data.total}
                       pageSize={this.props.widget.configuration.pageSize}
                       className="tenantsTable">

                    <DataTable.Column label="Name" name="name" width="40%" />
                    <DataTable.Column label="Name" name="groups" width="30%" />
                    <DataTable.Column label="Name" name="users" width="30%" />

                    {
                        this.props.data.items.map((item) => {
                            return (
                                <DataTable.Row key={item.name} selected={item.isSelected} onClick={this._selectTenant.bind(this, item.name)}>
                                    <DataTable.Data>{item.name}</DataTable.Data>
                                    <DataTable.Data>{item.groups}</DataTable.Data>
                                    <DataTable.Data>{item.users}</DataTable.Data>
                                </DataTable.Row>
                            );
                        })
                    }
                </DataTable>
            </div>
        );
    }
}
