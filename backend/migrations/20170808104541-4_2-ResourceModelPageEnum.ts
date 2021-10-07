import { QueryInterface } from 'sequelize';

export const { up, down } = {
    up(queryInterface: QueryInterface) {
        return queryInterface.sequelize.query('ALTER TYPE "enum_Resources_type" ADD VALUE IF NOT EXISTS \'page\';');
    },

    down() {
        // Nothing to do
    }
};
