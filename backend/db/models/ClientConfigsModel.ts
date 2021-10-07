import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) =>
    sequelize.define(
        'ClientConfigs',
        {
            managerIp: { type: dataTypes.STRING, allowNull: false },
            config: { type: dataTypes.JSON, allowNull: false }
        },
        {
            indexes: [
                {
                    unique: true,
                    fields: ['managerIp']
                }
            ]
        }
    );
