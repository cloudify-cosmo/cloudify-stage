import sequelize, { QueryInterface } from 'sequelize';

export const { up, down } = {
    up: (queryInterface: QueryInterface, Sequelize: typeof sequelize) => {
        return queryInterface
            .createTable('BlueprintUserData', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER
                },
                blueprintId: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                username: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                layout: {
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
                queryInterface.addIndex('BlueprintUserData', ['blueprintId', 'username'], {
                    type: 'UNIQUE'
                })
            );
    },
    down: (queryInterface: QueryInterface) => {
        return queryInterface.dropTable('BlueprintUserData').then(() =>
            queryInterface.removeIndex('BlueprintUserData', ['blueprintId', 'username'], {
                type: 'UNIQUE'
            })
        );
    }
};
