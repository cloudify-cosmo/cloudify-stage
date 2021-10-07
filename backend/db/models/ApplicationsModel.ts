import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) =>
    sequelize.define('Applications', {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: dataTypes.STRING,
            allowNull: false
        },
        status: { type: dataTypes.INTEGER },
        isPrivate: { type: dataTypes.BOOLEAN },
        extras: { type: dataTypes.JSON }
    });
