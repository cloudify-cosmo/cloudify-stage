/* eslint-disable node/no-unpublished-import, import/no-extraneous-dependencies */
import { DataTypes } from 'sequelize';
import type { UpDownFunction } from 'cloudify-ui-common/backend/migration';

export type { QueryInterface, QueryInterfaceIndexOptions } from 'sequelize';
export type DataTypes = typeof DataTypes;
export type MigrationObject = { up: UpDownFunction; down: UpDownFunction };
