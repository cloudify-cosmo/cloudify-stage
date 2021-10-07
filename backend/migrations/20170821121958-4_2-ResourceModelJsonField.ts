import sequelize, { QueryInterface } from 'sequelize';

const DATA_COLUMN_NAME = 'data';

export const { up, down } = {
    up(queryInterface: QueryInterface, Sequelize: typeof sequelize) {
        return queryInterface.addColumn('Resources', DATA_COLUMN_NAME, {
            type: Sequelize.JSONB,
            allowNull: true
        });
    },

    down(queryInterface: QueryInterface) {
        return queryInterface.removeColumn('Resources', DATA_COLUMN_NAME);
    }
};
