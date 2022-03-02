// eslint-disable-next-line import/no-extraneous-dependencies,node/no-unpublished-import
import { DataTypes } from 'sequelize';
import { UpDownFunction } from 'cloudify-ui-common/backend/migration';

export type DataTypes = typeof DataTypes;
// eslint-disable-next-line import/no-extraneous-dependencies,node/no-unpublished-import
export type { QueryInterface, QueryInterfaceIndexOptions } from 'sequelize';
export type MigrationObject = { up: UpDownFunction; down: UpDownFunction };
