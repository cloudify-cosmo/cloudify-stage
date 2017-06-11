'use strict';

function createResourcesModel (queryInterface,Sequelize) {
    return queryInterface.createTable('Resources', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },

        resourceId : {type: Sequelize.STRING, allowNull: false },
        type : {type: Sequelize.ENUM, values: ['widget','template'], allowNull: false},
        creator: { type: Sequelize.STRING, allowNull: true},

        createdAt: {
            allowNull: false,
            type: Sequelize.DATE
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
        }
    }).then(function() {
        return queryInterface.addIndex(
            'Resources',
            ['resourceId','type'],
            {
                indicesType: 'UNIQUE'
            }
        )
    });
}

module.exports = {
  up: function (queryInterface, Sequelize) {
      return createResourcesModel(queryInterface,Sequelize);
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.dropTable('Resources');
  }
};
