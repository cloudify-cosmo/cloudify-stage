import { Sequelize, DataTypes } from 'sequelize';
import ResourceTypes from '../types/ResourceTypes';

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) =>
    sequelize.define(
        'Resources',
        {
            resourceId: { type: dataTypes.STRING, allowNull: false },
            type: { type: dataTypes.ENUM, values: ResourceTypes.values, allowNull: false },
            creator: { type: dataTypes.STRING, allowNull: true },
            data: { type: dataTypes.JSONB, allowNull: true }
        },
        { indexes: [{ unique: true, fields: ['resourceId'] }] }
    );
