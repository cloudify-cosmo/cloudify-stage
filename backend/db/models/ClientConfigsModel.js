module.exports = (sequelize, DataTypes) =>
    sequelize.define(
        'ClientConfigs',
        {
            managerIp: { type: DataTypes.STRING, allowNull: false },
            config: { type: DataTypes.JSON, allowNull: false }
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
