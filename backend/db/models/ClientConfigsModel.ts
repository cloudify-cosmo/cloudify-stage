import type { CommonAttributes, Model, ModelFactory } from './types';

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
