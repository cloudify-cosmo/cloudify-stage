'use strict';

module.exports = {

    up: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query('ALTER TYPE \"enum_Resources_type\" ADD VALUE IF NOT EXISTS \'page\';');
    },

    down: function (queryInterface, Sequelize) {
        // Nothing to do
    }
};
