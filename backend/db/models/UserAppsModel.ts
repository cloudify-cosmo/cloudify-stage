import { DataTypes, Model, ModelDefined, Optional, Sequelize } from 'sequelize';
import { MODE_COMMUNITY, MODE_CUSTOMER, MODE_MAIN, Mode } from '../../serverSettings';

interface UserAppsAttributes {
    username: string;
    appDataVersion: number;
    mode: Mode;
    tenant: string;
    appData: { pages: any[] };
}
type UserAppsAttributesCreationAttributes = UserAppsAttributes;
interface UserAppsInstance extends Model<UserAppsAttributes, UserAppsAttributesCreationAttributes>, UserAppsAttributes {
    readonly id: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) =>
    sequelize.define<UserAppsInstance>(
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
