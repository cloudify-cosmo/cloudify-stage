import type { ModelFactory } from 'cloudify-ui-common/backend';

const ApplicationsModelFactory: ModelFactory = (sequelize, dataTypes) =>
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
export default ApplicationsModelFactory;
