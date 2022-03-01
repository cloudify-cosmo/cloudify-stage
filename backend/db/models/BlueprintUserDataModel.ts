import type { ModelFactory } from 'cloudify-ui-common/backend';

const BlueprintUserDataModelFactory: ModelFactory = (sequelize, dataTypes) =>
    sequelize.define(
        'BlueprintUserData',
        {
            blueprintId: { type: dataTypes.INTEGER, allowNull: false },
            username: { type: dataTypes.STRING, allowNull: false },
            layout: { type: dataTypes.JSON, allowNull: false }
        },
        { indexes: [{ unique: true, fields: ['blueprintId', 'username'] }] }
    );
export default BlueprintUserDataModelFactory;
