import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) =>
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
