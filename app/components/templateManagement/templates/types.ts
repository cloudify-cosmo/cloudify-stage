export interface PageMenuItem {
    id: string;
    type: 'page' | 'pageGroup';
}

export interface CommonListProps {
    custom: boolean;
    onDelete: (listItem: string) => void;
    style?: React.CSSProperties;
}
