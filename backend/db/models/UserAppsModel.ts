// eslint-disable-next-line import/no-extraneous-dependencies,node/no-unpublished-import
import type { Model } from 'sequelize';
import type { ModelFactory } from 'cloudify-ui-common/backend/db';

import { MODE_COMMUNITY, MODE_CUSTOMER, MODE_MAIN } from '../../serverSettings';
import type { UserAppsAttributes } from './UserAppsModel.types';

export type UserAppsCreationAttributes = UserAppsAttributes;
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
