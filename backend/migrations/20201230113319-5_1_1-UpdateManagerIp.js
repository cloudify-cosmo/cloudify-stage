const UserApp = require('../db/models/UserAppModel');
const config = require('../config').getConfig();

module.exports = {
    up: (queryInterface, Sequelize) => {
        UserApp(queryInterface.sequelize, Sequelize).update(
            { managerIp: config.manager.ip },
            { where: { managerIp: '127.0.0.1' } }
        );
    },

    down: (/* queryInterface, Sequelize */) => {}
};
