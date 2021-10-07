import sequelize, { QueryInterface } from 'sequelize';
import UserApps from '../db/models/UserAppsModel';
import { getConfig } from '../config';

const config = getConfig();

export const { up, down } = {
    up: (queryInterface: QueryInterface, Sequelize: typeof sequelize) => {
        UserApps(queryInterface.sequelize, Sequelize).update(
            { managerIp: config.manager.ip },
            { where: { managerIp: '127.0.0.1' } }
        );
    },

    down: (/* queryInterface, Sequelize */) => {}
};
