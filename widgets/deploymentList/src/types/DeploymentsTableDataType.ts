type DeploymentsTableItemType = {
    id: string;
    display_name: string;
    blueprint_id: string;
    label: string;
};

type DeploymentsTableDataType = {
    total: number;
    items: DeploymentsTableItemType[];
};

export default DeploymentsTableDataType;
