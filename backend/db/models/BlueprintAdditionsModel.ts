import type { ModelFactory } from 'cloudify-ui-common/backend';

const BlueprintAddintionsModelFactory: ModelFactory = (sequelize, dataTypes) =>
    sequelize.define(
        'BlueprintAdditions',
        {
            blueprintId: { type: dataTypes.STRING, allowNull: false },
            image: { type: dataTypes.BLOB, allowNull: true },
            imageUrl: { type: dataTypes.STRING, allowNull: true }
        },
        {
            indexes: [
                {
                    unique: true,
                    fields: ['blueprintId']
                }
            ]
        }
    );
export default BlueprintAddintionsModelFactory;
