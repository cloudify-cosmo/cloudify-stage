import type { CommonAttributes } from './types';
import type { Mode } from '../../serverSettings';
import type { PageFileDefinition } from '../../routes/Templates.types';

export interface UserAppsData {
    username: string;
    appDataVersion: number;
    mode: Mode;
    tenant: string;
    appData: { pages: PageFileDefinition[] };
}

export interface UserAppsAttributes extends CommonAttributes, UserAppsData {}
