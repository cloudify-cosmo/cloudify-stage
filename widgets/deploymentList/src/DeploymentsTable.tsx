import type { FunctionComponent } from 'react';

import type DeploymentsTableDataType from './types/DeploymentsTableDataType';
import type { DeploymentListWidget } from './types/DeploymentList';

interface DeploymentsTableProps {
    data: DeploymentsTableDataType;
    fetchData: (fetchParams: any) => void;
    widget: Stage.Types.Widget<DeploymentListWidget.Configuration>;
    noDataMessage: string;
}

const DeploymentsTable: FunctionComponent<DeploymentsTableProps> = ({
    data,
    fetchData,
    noDataMessage,
    widget
}) => {
    const { DataTable } = Stage.Basic;
    const tableName = 'deploymentsTable';
    
    const tableRowList = data.items.map(item => (
        <DataTable.Row
            id={`${tableName}_${item.id}`}
            key={item.id}
        >
            {/* ID */}
            <DataTable.Data>{item.id}</DataTable.Data>

            {/* Deployment Name */}
            <DataTable.Data>{item.display_name}</DataTable.Data>

            {/* Blueprint Name */}
            <DataTable.Data>{item.blueprint_id}</DataTable.Data>

            {/* Status */}
            <DataTable.Data>
                {item.label}
            </DataTable.Data>

        </DataTable.Row>
    ));

    return (
        <DataTable
            fetchData={fetchData}
            totalSize={data.total}
            pageSize={widget.configuration.pageSize}
            sortColumn={widget.configuration.sortColumn}
            sortAscending={widget.configuration.sortAscending}
            className={tableName}
            noDataMessage={noDataMessage}
        >
            <DataTable.Column label="ID" name="id" />
            <DataTable.Column label="Deployment Name" name="deployment_name" width="25%" />
            <DataTable.Column label="Blueprint Name" name="blueprint_name" width="25%" />
            <DataTable.Column label="Status" name="status" width="10%" />

            {tableRowList}
        </DataTable>
    );
}

export default DeploymentsTable;
