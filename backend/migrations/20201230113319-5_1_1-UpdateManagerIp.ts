import UserApps from '../db/models/UserAppsModel';
import { getConfig } from '../config';
import type { MigrationObject } from './common/types';

const config = getConfig();

export const { up, down }: MigrationObject = {
    up: (queryInterface, Sequelize) =>
        UserApps(queryInterface.sequelize, Sequelize).update(
            // @ts-ignore managerIp column was removed from UserApps model
            { managerIp: config.manager.ip },
            { where: { managerIp: '127.0.0.1' } }
        ),
    down: () => Promise.resolve()
};
