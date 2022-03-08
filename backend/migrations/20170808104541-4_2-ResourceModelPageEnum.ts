import type { MigrationObject } from './common/types';

export const { up, down }: MigrationObject = {
    up(queryInterface) {
        return queryInterface.sequelize.query('ALTER TYPE "enum_Resources_type" ADD VALUE IF NOT EXISTS \'page\';');
    },

    down() {
        // Nothing to do
        return Promise.resolve();
    }
};
