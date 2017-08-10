'use strict';

module.exports = {


    up: function (queryInterface, Sequelize) {
        // NOTE: Cannot use db-agnostic queryInterface.changeColumn method, because of error.
        // It is known issue: https://github.com/sequelize/sequelize/issues/2554
        // Used solution from: https://stackoverflow.com/questions/25048702/how-do-you-add-enum-labels-using-sequelize
        return queryInterface.sequelize.query('ALTER TYPE \"enum_UserApps_mode\" ADD VALUE IF NOT EXISTS \'community\';');
    },

    down: function (queryInterface, Sequelize) {
        // Nothing to do
    }
};
