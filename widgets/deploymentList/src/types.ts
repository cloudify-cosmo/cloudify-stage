export declare namespace DeploymentListWidget {
    export type Configuration = {
        pageSize: number;
        sortColumn: string;
        sortAscending: boolean;
    };
}

type DeploymentsTableItemType = {
    id: string;
    displayName: string;
    blueprintId: string;
    label: string;
};

export type DeploymentsTableDataType = {
    total: number;
    items: DeploymentsTableItemType[];
};
