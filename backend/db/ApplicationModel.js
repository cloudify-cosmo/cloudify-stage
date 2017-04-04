/**
 * Created by Alex on 21/03/2017.
 */

'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Application', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: { type: DataTypes.INTEGER },
        isPrivate: { type: DataTypes.BOOLEAN },
        extras: { type: DataTypes.JSON }
    });
};
