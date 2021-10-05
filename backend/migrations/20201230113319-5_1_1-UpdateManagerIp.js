const UserApps = require('../db/models/UserAppsModel');
const config = require('../config').getConfig();

module.exports = {
    up: (queryInterface, Sequelize) => {
        UserApps(queryInterface.sequelize, Sequelize).update(
            { managerIp: config.manager.ip },
            { where: { managerIp: '127.0.0.1' } }
        );
    },

    down: (/* queryInterface, Sequelize */) => {}
};
