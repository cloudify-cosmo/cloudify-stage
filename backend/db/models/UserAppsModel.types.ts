import type { CommonAttributes } from './types';
import type { Mode } from '../../serverSettings';
import type { LayoutSection } from '../../routes/Templates.types';

export interface AppDataPage {
    id: string;
    name: string;
    type: 'page';
    icon?: string;
    description?: string;
    layout: LayoutSection[];
}

export interface UserAppsData {
    username: string;
    appDataVersion: number;
    mode: Mode;
    tenant: string;
    appData: { pages: AppDataPage[] };
}

export type UserAppsAttributes = CommonAttributes & UserAppsData;
