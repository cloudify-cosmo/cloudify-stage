import type { DataTableConfiguration } from 'app/utils/GenericConfig';
import type { Widget } from 'app/utils/StageAPI';

export type Groups = Record<string, { users: any; role: string }>;

export interface Tenant {
    name: string;
    groups: Record<string, string>;
    users: Record<string, { 'tenant-role': unknown }>;
    // eslint-disable-next-line camelcase
    user_roles: { direct: Record<string, string>; groups: Groups };
}

export type TenantsWidget = Widget<DataTableConfiguration>;
