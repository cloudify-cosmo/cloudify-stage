import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
    return sequelize.define(
        'BlueprintUserData',
        {
            blueprintId: { type: dataTypes.INTEGER, allowNull: false },
            username: { type: dataTypes.STRING, allowNull: false },
            layout: { type: dataTypes.JSON, allowNull: false }
        },
        { indexes: [{ unique: true, fields: ['blueprintId', 'username'] }] }
    );
};
