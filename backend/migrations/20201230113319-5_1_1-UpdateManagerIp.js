const _ = require('lodash');
const UserApp = require('../db/UserAppModel');
const config = require('../config').get();

module.exports = {
    up: (queryInterface, Sequelize) => {
        UserApp(queryInterface.sequelize, Sequelize)
            .findAll()
            .then(results =>
                _.each(results, userAppRow => {
                    if (userAppRow.managerIp === '127.0.0.1') {
                        userAppRow.managerIp = config.manager.ip;
                        userAppRow.save();
                    }
                })
            );
    },

    down: (/* queryInterface, Sequelize */) => {}
};
