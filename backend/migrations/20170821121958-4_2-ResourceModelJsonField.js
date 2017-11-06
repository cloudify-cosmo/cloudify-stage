'use strict';

var DATA_COLUMN_NAME = 'data';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.addColumn('Resources', DATA_COLUMN_NAME, {
        type: Sequelize.JSONB,
        allowNull: true
    });
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.removeColumn('Resources', DATA_COLUMN_NAME);
  }
};
