import sequelize, { QueryInterface } from 'sequelize';

function createResourcesModel(queryInterface: QueryInterface, Sequelize: typeof sequelize) {
    return queryInterface
        .createTable('Resources', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },

            resourceId: { type: Sequelize.STRING, allowNull: false },
            type: { type: Sequelize.ENUM, values: ['widget', 'template'], allowNull: false },
            creator: { type: Sequelize.STRING, allowNull: true },

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
            queryInterface.addIndex('Resources', ['resourceId', 'type'], {
                type: 'UNIQUE'
            })
        );
}

export const { up, down } = {
    up(queryInterface: QueryInterface, Sequelize: typeof sequelize) {
        return createResourcesModel(queryInterface, Sequelize);
    },

    down(queryInterface: QueryInterface) {
        return queryInterface.dropTable('Resources');
    }
};
