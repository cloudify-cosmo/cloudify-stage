import type { CommonAttributes, Model, ModelFactory, Optional } from './types';

interface WidgetBackendsAttributes {
    widgetId: string;
    serviceName: string;
    method: string;
    script: string;
}
type WidgetBackendsCreationAttributes = Optional<WidgetBackendsAttributes, 'script'>;
export type WidgetBackendsInstance = Model<WidgetBackendsAttributes, WidgetBackendsCreationAttributes> &
    WidgetBackendsAttributes &
    CommonAttributes;

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
