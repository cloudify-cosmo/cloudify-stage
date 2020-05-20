/**
 * Created by Alex on 21/03/2017.
 */

module.exports = (sequelize, DataTypes) =>
    sequelize.define('Application', {
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
