/**
 * Created by jakub.niezgoda on 23/04/2019.
 */

module.exports = (sequelize, DataTypes) =>
    sequelize.define(
        'WidgetBackend',

        {
            widgetId: { type: DataTypes.STRING, allowNull: false },
            serviceName: { type: DataTypes.STRING, allowNull: false },
            method: { type: DataTypes.STRING, allowNull: false },
            script: { type: DataTypes.JSONB, allowNull: true }
        },
        { indexes: [{ unique: true, fields: ['widgetId', 'serviceName', 'method'] }] }
    );
