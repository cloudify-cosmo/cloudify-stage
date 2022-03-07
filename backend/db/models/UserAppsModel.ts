import type { CommonAttributes, Model, ModelFactory } from './types';
import { MODE_COMMUNITY, MODE_CUSTOMER, MODE_MAIN, Mode } from '../../serverSettings';
import type { PageFileDefinition } from '../../routes/Templates.types';

interface UserAppsAttributes extends CommonAttributes {
    username: string;
    appDataVersion: number;
    mode: Mode;
    tenant: string;
    appData: { pages: PageFileDefinition[] };
}
type UserAppsCreationAttributes = UserAppsAttributes;
export type UserAppsInstance = Model<UserAppsAttributes, UserAppsCreationAttributes> & UserAppsAttributes;

const UserAppsModelFactory: ModelFactory<UserAppsInstance> = (sequelize, dataTypes) =>
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
export default UserAppsModelFactory;
