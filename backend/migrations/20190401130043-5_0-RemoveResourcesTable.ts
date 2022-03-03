import ResourceTypes from '../db/types/ResourceTypes';
import type { MigrationObject } from './common/types';

export const { up, down }: MigrationObject = {
    up: (queryInterface, _Sequelize, logger) => {
        return queryInterface
            .dropTable('Resources', { cascade: true, logging: logger.info, benchmark: true })
            .then(() => queryInterface.removeIndex('Resources', ['resourceId', 'type'], { type: 'UNIQUE' }));
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface
            .createTable('Resources', {
                id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },

                resourceId: { type: Sequelize.STRING, allowNull: false },
                type: { type: Sequelize.ENUM, values: ResourceTypes.values, allowNull: false },
                creator: { type: Sequelize.STRING, allowNull: true },
                data: { type: Sequelize.JSONB, allowNull: true },

                createdAt: { type: Sequelize.DATE, allowNull: false },
                updatedAt: { type: Sequelize.DATE, allowNull: false }
            })
            .then(() => queryInterface.addIndex('Resources', ['resourceId', 'type'], { type: 'UNIQUE' }));
    }
};
