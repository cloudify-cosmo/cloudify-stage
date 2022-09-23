// eslint-disable-next-line import/no-extraneous-dependencies,node/no-unpublished-import
import type { Model, Optional } from 'sequelize';
import type { ModelFactory } from 'cloudify-ui-common/backend/db';

import type { ResourceType } from '../types/ResourceTypes';
import ResourceTypes from '../types/ResourceTypes';
import type { CommonAttributes } from './types';

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
