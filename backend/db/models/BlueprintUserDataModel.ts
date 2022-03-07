import type { CommonAttributes, Model, ModelFactory } from './types';

interface BlueprintUserDataAttributes extends CommonAttributes {
    blueprintId: string;
    username: string;
    layout: any;
}
type BlueprintUserDataCreationAttributes = BlueprintUserDataAttributes;
export type BlueprintUserDataInstance = Model<BlueprintUserDataAttributes, BlueprintUserDataCreationAttributes> &
    BlueprintUserDataAttributes;

const BlueprintUserDataModelFactory: ModelFactory<BlueprintUserDataInstance> = (sequelize, dataTypes) =>
    sequelize.define<BlueprintUserDataInstance>(
        'BlueprintUserData',
        {
            blueprintId: { type: dataTypes.INTEGER, allowNull: false },
            username: { type: dataTypes.STRING, allowNull: false },
            layout: { type: dataTypes.JSON, allowNull: false }
        },
        { indexes: [{ unique: true, fields: ['blueprintId', 'username'] }] }
    );
export default BlueprintUserDataModelFactory;
