interface ScanningItemCommon {
    key: string;
    title: string;
    isDir: boolean;
}

export interface ScanningDir extends ScanningItemCommon {
    isDir: true;
    children: ScanningItem[];
}

export interface ScanningFile extends ScanningItemCommon {
    isDir: false;
}

export type ScanningItem = ScanningDir | ScanningFile;
