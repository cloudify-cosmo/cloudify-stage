import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) =>
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
