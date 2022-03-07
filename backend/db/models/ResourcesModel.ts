import type { CommonAttributes, Model, ModelFactory, Optional } from './types';
import ResourceTypes, { ResourceType } from '../types/ResourceTypes';

interface ResourcesAttributes extends CommonAttributes {
    resourceId: string;
    type: ResourceType;
    creator: string;
    data: any;
}
type ResourcesCreationAttributes = Optional<ResourcesAttributes, 'creator' | 'data'>;
export type ResourcesInstance = Model<ResourcesAttributes, ResourcesCreationAttributes> & ResourcesAttributes;

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
