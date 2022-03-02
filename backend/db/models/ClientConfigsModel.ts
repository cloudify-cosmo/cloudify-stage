import type { Model, ModelFactory } from 'cloudify-ui-common/backend';
import { CommonAttributes } from './types';

interface ClientConfigsAttributes {
    managerIp: string;
    config: any;
}
type ClientConfigsCreationAttributes = ClientConfigsAttributes;
export type ClientConfigsInstance = Model<ClientConfigsAttributes, ClientConfigsAttributes> &
    ClientConfigsAttributes &
    CommonAttributes;

const ClientConfigsModelFactory: ModelFactory<ClientConfigsInstance> = (sequelize, dataTypes) =>
    sequelize.define<ClientConfigsInstance>(
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
