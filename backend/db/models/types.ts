export type { ModelFactory } from 'cloudify-ui-common/backend/db';
// eslint-disable-next-line import/no-extraneous-dependencies,node/no-unpublished-import
export type { Model, Optional } from 'sequelize';

export interface CommonAttributes {
    readonly id: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
