// eslint-disable-next-line import/no-extraneous-dependencies,node/no-unpublished-import
import type { Model, Optional } from 'sequelize';
import type { ModelFactory } from 'cloudify-ui-common/backend/db';
import type { WidgetBackendsAttributes } from './WidgetBackendsModel.types';

type WidgetBackendsCreationAttributes = Optional<WidgetBackendsAttributes, 'script'>;
export type WidgetBackendsInstance = Model<WidgetBackendsAttributes, WidgetBackendsCreationAttributes> &
    WidgetBackendsAttributes;

const WidgetBackendsModelFactory: ModelFactory<WidgetBackendsInstance> = (sequelize, dataTypes) =>
    sequelize.define(
        'WidgetBackends',
        {
            widgetId: { type: dataTypes.STRING, allowNull: false },
            serviceName: { type: dataTypes.STRING, allowNull: false },
            method: { type: dataTypes.STRING, allowNull: false },
            script: { type: dataTypes.JSONB, allowNull: true }
        },
        { indexes: [{ unique: true, fields: ['widgetId', 'serviceName', 'method'] }] }
    );
export default WidgetBackendsModelFactory;
