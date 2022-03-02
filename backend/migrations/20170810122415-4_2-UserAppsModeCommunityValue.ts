import type { MigrationObject } from './common/types';

export const { up, down }: MigrationObject = {
    up(queryInterface) {
        // NOTE: Cannot use db-agnostic queryInterface.changeColumn method, because of error.
        // It is known issue: https://github.com/sequelize/sequelize/issues/2554
        // Used solution from: https://stackoverflow.com/questions/25048702/how-do-you-add-enum-labels-using-sequelize
        return queryInterface.sequelize.query('ALTER TYPE "enum_UserApps_mode" ADD VALUE IF NOT EXISTS \'community\';');
    },

    down() {
        // Nothing to do
        return Promise.resolve();
    }
};
