type DeploymentsTableItemType = {
    id: string;
    displayName: string;
    blueprintId: string;
    label: string;
};

type DeploymentsTableDataType = {
    total: number;
    items: DeploymentsTableItemType[];
};

export default DeploymentsTableDataType;
