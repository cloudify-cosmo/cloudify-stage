import type { ModelFactory } from 'cloudify-ui-common/backend';

const WidgetBackendsModelFactory: ModelFactory = (sequelize, dataTypes) =>
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
