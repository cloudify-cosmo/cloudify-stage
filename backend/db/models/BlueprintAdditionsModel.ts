import type { Model, ModelFactory, Optional } from 'cloudify-ui-common/backend';
import { CommonAttributes } from './types';

interface BlueprintAdditionsAttributes {
    blueprintId: string;
    image: any;
    imageUrl: string;
}
type BlueprintAdditionsCreationAttributes = Optional<BlueprintAdditionsAttributes, 'image' | 'imageUrl'>;
export type BlueprintAdditionsInstance = Model<BlueprintAdditionsAttributes, BlueprintAdditionsAttributes> &
    BlueprintAdditionsAttributes &
    CommonAttributes;

const BlueprintAddintionsModelFactory: ModelFactory<BlueprintAdditionsInstance> = (sequelize, dataTypes) =>
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
export default BlueprintAddintionsModelFactory;
