export interface ScanningDir {
    key: string;
    title: string;
    isDir: true;
    children: ScanningItem[];
}

export interface ScanningFile {
    key: string;
    title: string;
    isDir: false;
}

export type ScanningItem = ScanningDir | ScanningFile;
