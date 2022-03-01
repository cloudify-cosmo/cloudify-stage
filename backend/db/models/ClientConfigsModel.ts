import type { ModelFactory } from 'cloudify-ui-common/backend';

const ClientConfigsModelFactory: ModelFactory = (sequelize, dataTypes) =>
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
export default ClientConfigsModelFactory;
