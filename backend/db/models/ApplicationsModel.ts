import type { CommonAttributes, Model, ModelFactory, Optional } from './types';

interface ApplicationsAttributes extends CommonAttributes {
    name: string;
    status: number;
    isPrivate: boolean;
    extras: Record<string, any>;
}
type ApplicationsCreationAttributes = Optional<ApplicationsAttributes, 'status' | 'isPrivate' | 'extras'>;
export type ApplicationsInstance = Model<ApplicationsAttributes, ApplicationsCreationAttributes> &
    ApplicationsAttributes;

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
