export interface ScanningItem {
    key: string;
    title: string;
    isDir: boolean;
    children: ScanningItem[];
}
