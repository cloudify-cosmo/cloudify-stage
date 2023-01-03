export type DropdownValue = string | string[] | null;
export type Field = { name: string; value: unknown; type: string; checked?: boolean };
export type Visibility = 'private' | 'tenant' | 'global' | 'unknown';
export type FetchParams = { gridParams: Stage.Types.GridParams };
