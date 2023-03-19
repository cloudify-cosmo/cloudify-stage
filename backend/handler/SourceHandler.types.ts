interface ScanningDir {
    key: string;
    title: string;
    isDir: true;
    children: ScanningItem[];
}

interface ScanningFile {
    key: string;
    title: string;
    isDir: false;
}

export type ScanningItem = ScanningDir | ScanningFile;
