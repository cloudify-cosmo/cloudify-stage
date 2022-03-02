import type { MigrationObject } from './types';

const DATA_COLUMN_NAME = 'data';

export const { up, down }: MigrationObject = {
    up(queryInterface, Sequelize) {
        return queryInterface.addColumn('Resources', DATA_COLUMN_NAME, {
            type: Sequelize.JSONB,
            allowNull: true
        });
    },

    down(queryInterface) {
        return queryInterface.removeColumn('Resources', DATA_COLUMN_NAME);
    }
};
