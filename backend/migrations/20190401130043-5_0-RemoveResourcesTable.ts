import { Logger } from 'cloudify-ui-common/backend/logger';
import sequelize, { QueryInterface } from 'sequelize';
import ResourceTypes from '../db/types/ResourceTypes';

export const { up, down } = {
    up: (queryInterface: QueryInterface, Sequelize: typeof sequelize, logger: Logger) => {
        return queryInterface
            .dropTable('Resources', { cascade: true, logging: logger.info, benchmark: true })
            .then(() => queryInterface.removeIndex('Resources', ['resourceId', 'type'], { type: 'UNIQUE' }));
    },

    down: (queryInterface: QueryInterface, Sequelize: typeof sequelize) => {
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
