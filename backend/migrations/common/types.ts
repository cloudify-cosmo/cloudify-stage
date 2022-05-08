// eslint-disable-next-line import/no-extraneous-dependencies,node/no-unpublished-import
import type { DataTypes } from 'sequelize';
import type { UpDownFunction } from 'cloudify-ui-common/backend/migration';

export type DataTypes = typeof DataTypes;
// eslint-disable-next-line import/no-extraneous-dependencies,node/no-unpublished-import
export type { QueryInterface, QueryInterfaceIndexOptions } from 'sequelize';
export type MigrationObject = { up: UpDownFunction; down: UpDownFunction };
