import { UpDownFunction } from 'cloudify-ui-common/backend/migration';

export type { DataTypes, QueryInterface, QueryInterfaceIndexOptions } from 'cloudify-ui-common/backend/migration';
export type MigrationObject = { up: UpDownFunction; down: UpDownFunction };
