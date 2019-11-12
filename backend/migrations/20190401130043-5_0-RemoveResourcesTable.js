const ResourceTypes = require('../db/types/ResourceTypes');

module.exports = {
    up: (queryInterface, Sequelize, logger) => {
        return queryInterface
            .dropTable('Resources', { cascade: true, logging: logger.info, benchmark: true })
            .then(function() {
                return queryInterface.removeIndex('Resources', ['resourceId', 'type'], { indicesType: 'UNIQUE' });
            });
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
            .then(function() {
                return queryInterface.addIndex('Resources', ['resourceId', 'type'], { indicesType: 'UNIQUE' });
            });
    }
};
