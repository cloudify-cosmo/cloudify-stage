export type { ModelFactory, Model, Optional } from 'cloudify-ui-common/backend/db';

export interface CommonAttributes {
    readonly id: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
