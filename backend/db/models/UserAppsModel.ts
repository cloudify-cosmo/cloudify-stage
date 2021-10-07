import { Sequelize, DataTypes } from 'sequelize';
import { MODE_COMMUNITY, MODE_CUSTOMER, MODE_MAIN } from '../../serverSettings';

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) =>
    sequelize.define(
        'UserApps',
        {
            username: { type: dataTypes.STRING, allowNull: false },
            appDataVersion: { type: dataTypes.INTEGER, allowNull: false },
            mode: {
                type: dataTypes.ENUM,
                values: [MODE_CUSTOMER, MODE_MAIN, MODE_COMMUNITY],
                allowNull: false,
                defaultValue: MODE_MAIN
            },
            tenant: { type: dataTypes.STRING, allowNull: false, defaultValue: 'default_tenant' },
            appData: { type: dataTypes.JSON, allowNull: false }
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
