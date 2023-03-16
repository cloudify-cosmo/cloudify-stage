interface ScanningDir {
    key: string;
    title: string;
    isDir: true;
    children: ScanningItem[];
}

type EmptyArray = [];

interface ScanningFile {
    key: string;
    title: string;
    isDir: false;
    children: EmptyArray;
}

export type ScanningItem = ScanningDir | ScanningFile;
