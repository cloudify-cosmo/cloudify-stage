import { createClientConfigs } from './20170425132017-4_0-init';
import type { MigrationObject } from './common/types';

export const { up, down }: MigrationObject = {
    up: (queryInterface, Sequelize) =>
        queryInterface
            .dropTable('ClientConfigs')
            .then(() => queryInterface.removeIndex('ClientConfigs', ['managerIp'], { type: 'UNIQUE' })),

    down: (queryInterface, Sequelize) => createClientConfigs(queryInterface, Sequelize)
};
