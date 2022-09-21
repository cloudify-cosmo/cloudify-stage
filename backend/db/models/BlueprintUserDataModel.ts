// eslint-disable-next-line import/no-extraneous-dependencies,node/no-unpublished-import
import type { Model } from 'sequelize';
import type { ModelFactory } from 'cloudify-ui-common/backend/db';
import type { BlueprintUserDataAttributes } from './BlueprintUserDataModel.types';

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
