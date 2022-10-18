// eslint-disable-next-line import/no-extraneous-dependencies,node/no-unpublished-import
import type { Model, Optional } from 'sequelize';
import type { ModelFactory } from 'cloudify-ui-common-backend';
import type { BlueprintAdditionsAttributes } from './BlueprintAdditionsModel.types';

type BlueprintAdditionsCreationAttributes = Optional<BlueprintAdditionsAttributes, 'image' | 'imageUrl'>;
export type BlueprintAdditionsInstance = Model<BlueprintAdditionsAttributes, BlueprintAdditionsCreationAttributes> &
    BlueprintAdditionsAttributes;

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
