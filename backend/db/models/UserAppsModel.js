/**
 * Created by kinneretzin on 13/02/2017.
 */
const ServerSettings = require('../../serverSettings');

module.exports = (sequelize, DataTypes) =>
    sequelize.define(
        'UserApps',
        {
            username: { type: DataTypes.STRING, allowNull: false },
            appDataVersion: { type: DataTypes.INTEGER, allowNull: false },
            mode: {
                type: DataTypes.ENUM,
                values: [ServerSettings.MODE_CUSTOMER, ServerSettings.MODE_MAIN, ServerSettings.MODE_COMMUNITY],
                allowNull: false,
                defaultValue: ServerSettings.MODE_MAIN
            },
            tenant: { type: DataTypes.STRING, allowNull: false, defaultValue: 'default_tenant' },
            appData: { type: DataTypes.JSON, allowNull: false }
        },
        {
            indexes: [
                {
                    unique: true,
                    fields: ['username', 'mode', 'tenant']
                }
            ]
        }
    );
