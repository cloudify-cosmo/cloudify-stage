import type { DataTypes, MigrationObject, QueryInterface } from './common/types';

export function createClientConfigs(queryInterface: QueryInterface, Sequelize: DataTypes) {
    return queryInterface
        .createTable('ClientConfigs', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            managerIp: {
                type: Sequelize.STRING,
                allowNull: false
            },
            config: {
                type: Sequelize.JSON,
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        })
        .then(() =>
            queryInterface.addIndex('ClientConfigs', ['managerIp'], {
                type: 'UNIQUE'
            })
        );
}

function createUserAppModel(queryInterface: QueryInterface, Sequelize: DataTypes) {
    return queryInterface
        .createTable('UserApps', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },

            managerIp: { type: Sequelize.STRING, allowNull: false },
            username: { type: Sequelize.STRING, allowNull: false },
            appDataVersion: { type: Sequelize.INTEGER, allowNull: false },
            mode: { type: Sequelize.ENUM, values: ['customer', 'main'], allowNull: false, defaultValue: 'main' },
            role: { type: Sequelize.ENUM, values: ['admin', 'user'], allowNull: false, defaultValue: 'user' },
            appData: { type: Sequelize.JSON, allowNull: false },

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        })
        .then(() =>
            queryInterface.addIndex('UserApps', ['managerIp', 'username', 'role', 'mode'], {
                type: 'UNIQUE'
            })
        );
}

export function createBlueprintAdditionsModel(queryInterface: QueryInterface, Sequelize: DataTypes) {
    return queryInterface
        .createTable('BlueprintAdditions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },

            blueprintId: { type: Sequelize.STRING, allowNull: false },
            image: { type: Sequelize.BLOB, allowNull: true },
            imageUrl: { type: Sequelize.STRING, allowNull: true },

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        })
        .then(() =>
            queryInterface.addIndex('BlueprintAdditions', ['blueprintId'], {
                type: 'UNIQUE'
            })
        );
}

export function createApplicationModel(queryInterface: QueryInterface, Sequelize: DataTypes) {
    return queryInterface
        .createTable('Applications', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },

            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            status: { type: Sequelize.INTEGER },
            isPrivate: { type: Sequelize.BOOLEAN },
            extras: { type: Sequelize.JSON },

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        })
        .then(() =>
            queryInterface.addIndex('Applications', ['id'], {
                type: 'UNIQUE'
            })
        );
}

export const { up, down }: MigrationObject = {
    up(queryInterface, Sequelize) {
        return createClientConfigs(queryInterface, Sequelize)
            .then(() => createUserAppModel(queryInterface, Sequelize))
            .then(() => createBlueprintAdditionsModel(queryInterface, Sequelize))
            .then(() => createApplicationModel(queryInterface, Sequelize));
    },
    down(queryInterface) {
        return queryInterface
            .dropTable('ClientConfigs')
            .then(() => queryInterface.dropTable('UserApps'))
            .then(() => queryInterface.dropTable('BlueprintAdditions'))
            .then(() => queryInterface.dropTable('Applications'));
    }
};
