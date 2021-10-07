import { Logger } from 'cloudify-ui-common/backend/logger';
import sequelize, { QueryInterface } from 'sequelize';

export const { up, down } = {
    up: (queryInterface: QueryInterface, Sequelize: typeof sequelize) => {
        return queryInterface
            .createTable('WidgetBackends', {
                id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },

                widgetId: { type: Sequelize.STRING, allowNull: false },
                serviceName: { type: Sequelize.STRING, allowNull: false },
                method: { type: Sequelize.STRING, allowNull: false },
                script: { type: Sequelize.JSONB, allowNull: true },

                createdAt: { type: Sequelize.DATE, allowNull: false },
                updatedAt: { type: Sequelize.DATE, allowNull: false }
            })
            .then(() =>
                queryInterface.addIndex('WidgetBackends', ['widgetId', 'serviceName', 'method'], {
                    type: 'UNIQUE'
                })
            );
    },

    down: (queryInterface: QueryInterface, Sequelize: typeof sequelize, logger: Logger) => {
        return queryInterface
            .dropTable('WidgetBackends', { cascade: true, logging: logger.info, benchmark: true })
            .then(() =>
                queryInterface.removeIndex('WidgetBackends', ['widgetId', 'serviceName', 'method'], {
                    type: 'UNIQUE'
                })
            );
    }
};
