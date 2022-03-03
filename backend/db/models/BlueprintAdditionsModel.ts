import type { CommonAttributes, Model, ModelFactory, Optional } from './types';

interface BlueprintAdditionsAttributes {
    blueprintId: string;
    image: any;
    imageUrl: string;
}
type BlueprintAdditionsCreationAttributes = Optional<BlueprintAdditionsAttributes, 'image' | 'imageUrl'>;
export type BlueprintAdditionsInstance = Model<BlueprintAdditionsAttributes, BlueprintAdditionsCreationAttributes> &
    BlueprintAdditionsAttributes &
    CommonAttributes;

const BlueprintAdditionsModelFactory: ModelFactory<BlueprintAdditionsInstance> = (sequelize, dataTypes) =>
    sequelize.define<BlueprintAdditionsInstance>(
        'BlueprintAdditions',
        {
            blueprintId: { type: dataTypes.STRING, allowNull: false },
            image: { type: dataTypes.BLOB, allowNull: true },
            imageUrl: { type: dataTypes.STRING, allowNull: true }
        },
        {
            indexes: [
                {
                    unique: true,
                    fields: ['blueprintId']
                }
            ]
        }
    );
export default BlueprintAdditionsModelFactory;
