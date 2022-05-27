import { createApplicationModel } from './20170425132017-4_0-init';
import type { MigrationObject } from './common/types';

export const { up, down }: MigrationObject = {
    up: queryInterface =>
        queryInterface
            .dropTable('Applications')
            .then(() => queryInterface.removeIndex('Applications', ['id'], { type: 'UNIQUE' })),

    down: (queryInterface, Sequelize) => createApplicationModel(queryInterface, Sequelize)
};
