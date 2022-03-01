import type { Model, Optional, ModelFactory } from 'cloudify-ui-common/backend';
import ResourceTypes, { ResourceType } from '../types/ResourceTypes';

interface ResourcesAttributes {
    resourceId: string;
    type: ResourceType;
    creator: string;
    data: any;
}
type ResourcesCreationAttributes = Optional<ResourcesAttributes, 'creator' | 'data'>;
interface ResourcesInstance extends Model<ResourcesAttributes, ResourcesCreationAttributes>, ResourcesAttributes {
    readonly id: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

const ResourcesModelFactory: ModelFactory<ResourcesInstance> = (sequelize, dataTypes) =>
    sequelize.define<ResourcesInstance>(
        'Resources',
        {
            resourceId: { type: dataTypes.STRING, allowNull: false },
            type: { type: dataTypes.ENUM, values: ResourceTypes.values, allowNull: false },
            creator: { type: dataTypes.STRING, allowNull: true },
            data: { type: dataTypes.JSONB, allowNull: true }
        },
        { indexes: [{ unique: true, fields: ['resourceId'] }] }
    );
export default ResourcesModelFactory;
