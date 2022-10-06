import type { CommonAttributes } from './types';
import type { Mode } from '../../serverSettings';
import type { LayoutSection } from '../../handler/templates/types';

export interface AppDataPage {
    id: string;
    name: string;
    type: 'page';
    icon?: string;
    description?: string;
    layout: LayoutSection[];
}

export interface AppDataPageGroup {
    id: string;
    name: string;
    type: 'pageGroup';
    icon?: string;
    pages: AppDataPage[];
}

export interface UserAppsData {
    username: string;
    appDataVersion: number;
    mode: Mode;
    tenant: string;
    appData: { pages: (AppDataPage | AppDataPageGroup)[] };
}

export type UserAppsAttributes = CommonAttributes & UserAppsData;
