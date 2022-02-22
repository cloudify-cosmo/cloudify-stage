import type { DeploymentListWidget, DeploymentsTableDataType } from './types';

interface DeploymentListProps {
    widget: Stage.Types.Widget<DeploymentListWidget.Configuration>;
    toolbox: Stage.Types.Toolbox;
    data: DeploymentsTableDataType;
}

interface DeploymentListState {
    error: string | null;
}

export default class DeploymentList extends React.Component<DeploymentListProps, DeploymentListState> {
    constructor(props: DeploymentListProps) {
        super(props);

        this.state = {
            error: null
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('deployments:refresh', this.refreshData, this);
    }

    shouldComponentUpdate(nextProps: DeploymentListProps, nextState: DeploymentListState) {
        const { data, widget } = this.props;
        return (
            !_.isEqual(widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(data, nextProps.data)
        );
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().off('deployments:refresh', this.refreshData);
    }

    onDismiss() {
        this.setState({ error: null });
    }

    setError = (errorMessage: string) => {
        this.setState({ error: errorMessage });
    };

    fetchData = (fetchParams: any) => {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };

    refreshData() {
        const { toolbox } = this.props;
        toolbox.refresh();
    }

    renderDeploymentTable() {
        const { data, widget } = this.props;
        const NO_DATA_MESSAGE = 'There are no Deployments available.';

        const { DataTable } = Stage.Basic;
        const tableName = 'deploymentsTable';

        const tableRowList = data.items.map(item => (
            <DataTable.Row id={`${tableName}_${item.id}`} key={item.id}>
                {/* ID */}
                <DataTable.Data>{item.id}</DataTable.Data>

                {/* Deployment Name */}
                <DataTable.Data>{item.displayName}</DataTable.Data>

                {/* Blueprint Name */}
                <DataTable.Data>{item.blueprintId}</DataTable.Data>

                {/* Status */}
                <DataTable.Data>{item.label}</DataTable.Data>
            </DataTable.Row>
        ));

        return (
            <DataTable
                fetchData={this.fetchData}
                totalSize={data.total}
                pageSize={widget.configuration.pageSize}
                sortColumn={widget.configuration.sortColumn}
                sortAscending={widget.configuration.sortAscending}
                className={tableName}
                noDataMessage={NO_DATA_MESSAGE}
            >
                <DataTable.Column label="ID" name="id" />
                <DataTable.Column label="Deployment Name" name="display_name" width="30%" />
                <DataTable.Column label="Blueprint Name" name="blueprint_id" width="30%" />
                <DataTable.Column label="Status" width="10%" />

                {tableRowList}
            </DataTable>
        );
    }

    render() {
        const { error } = this.state;
        const { ErrorMessage } = Stage.Basic;

        return (
            <>
                <ErrorMessage error={error} onDismiss={this.onDismiss} autoHide />
                {this.renderDeploymentTable()}
            </>
        );
    }
}
